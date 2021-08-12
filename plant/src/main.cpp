#include <Arduino.h>

#include <WiFi.h>

#include <ArduinoJson.h>
#include <arduino-timer.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

// #include <Hash.h>

SocketIOclient socketIO;

#define USE_SERIAL Serial

const char* ssid = "coba-beacon";
const char* pass = "ilomon0123";
const char* host = "tumblr-mk1.herokuapp.com";
const int port = 80;

const char* deviceId = "7b0dabce-3192-4030-ab63-364838bf187c";

const int pinRelay[]  = {33, 32};  // Pump, Motor
const int pinBuzzer   = 31;        // Buzzer
const int pinTouch    = 30;        // Touch Button

// Alarm set point
int lvl1[] = {0, 0}; // hour, minute
int lvl2[] = {0, 0}; // hour, minute
int lvl3[] = {0, 0}; // hour, minute

int isReady = 0;
int isRinging = 0;

#include <LiquidCrystal_I2C.h>
#include <Wire.h>

LiquidCrystal_I2C lcd(0x38);

Timer<2> task;

bool auth() {
  // creat JSON message for Socket.IO (event)
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  // add evnet name
  // Hint: socket.on('event_name', ....
  array.add("create");
  array.add("authentication");

  // add payload (parameters) for the event
  JsonObject data = array.createNestedObject();
  data["strategy"] = (String) "device";
  data["id"] = deviceId;

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  socketIO.sendEVENT(output);

  // Print JSON for debugging
  USE_SERIAL.println(output);
  return true;
}

// https://stackoverflow.com/questions/9072320/split-string-into-string-array
int getValue(String data, char separator, int index)
{
  int found = 0;
  int strIndex[] = {0, -1};
  int maxIndex = data.length()-1;

  for(int i=0; i<=maxIndex && found<=index; i++){
    if(data.charAt(i)==separator || i==maxIndex){
        found++;
        strIndex[0] = strIndex[1]+1;
        strIndex[1] = (i == maxIndex) ? i+1 : i;
    }
  }

  return found>index ? data.substring(strIndex[0], strIndex[1]).toInt() : 0;
}

void listenConfig(uint8_t * payload, size_t length) {
  DynamicJsonDocument doc(1024);
  deserializeJson(doc, payload, length);
  String event = doc[0];
  JsonObject data = doc[1]["config"];
  USE_SERIAL.printf("Event: %s\n", event.c_str());
  if(event == "devices patched") {
    lvl1[0] = getValue(data["lvl1"]["time"], ':', 0);
    lvl1[1] = getValue(data["lvl1"]["time"], ':', 1);
    lvl2[0] = getValue(data["lvl2"]["time"], ':', 0);
    lvl2[1] = getValue(data["lvl2"]["time"], ':', 1);
    lvl3[0] = getValue(data["lvl3"]["time"], ':', 0);
    lvl3[1] = getValue(data["lvl4"]["time"], ':', 1);
    isReady = 1;
  }
}

void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
  switch(type) {
    case sIOtype_DISCONNECT:
      USE_SERIAL.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
      auth();
      // join default namespace (no auto join in Socket.IO V3)
      // socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:
      USE_SERIAL.printf("[IOc] get event: %s\n", payload);
      listenConfig(payload, length);
      break;
    default:
      break;
  }
}

void alarm(int state) {
  digitalWrite(pinBuzzer, state);
}

bool getTouchButton() {
  return digitalRead(pinTouch);
}

bool mechanic(void *) {
  if(!isReady) return true;

  if(isRinging) {
    alarm(HIGH);
    if(getTouchButton()) {
      isRinging = 0;
    }
    return true;
  } else {
    alarm(LOW);
  }
  return true;
}

void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);
  lcd.begin(16, 2);

  pinMode(pinRelay[0], OUTPUT);
  pinMode(pinRelay[1], OUTPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinTouch, INPUT);

  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for(uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  lcd.home();

  // disable AP
  if(WiFi.getMode() & WIFI_AP) {
    WiFi.softAPdisconnect(true);
  }

  WiFi.mode(WIFI_STA);

  WiFi.disconnect();

  lcd.print("Connecting to:");
  lcd.setCursor(0,1);
  lcd.print(ssid);
  lcd.print("...");

  WiFi.begin(ssid, pass);
  while(WiFi.status() != WL_CONNECTED) {
    delay(100);
  }

  lcd.clear();
  lcd.home();

  String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

  lcd.print(ssid);
  lcd.print(" OK");

  lcd.setCursor(0,1);
  lcd.print("IP: ");
  lcd.print(ip.c_str());

  // server address, port and URL
  socketIO.begin(host, port);

  // event handler
  socketIO.onEvent(socketIOEvent);

  task.every(500, mechanic);

}

unsigned long messageTimestamp = 0;
void loop() {
  socketIO.loop();
  task.tick();

  // uint64_t now = millis();

  // if(now - messageTimestamp > 2000) {
  //   messageTimestamp = now;
  //
  //   // creat JSON message for Socket.IO (event)
  //   DynamicJsonDocument doc(1024);
  //   JsonArray array = doc.to<JsonArray>();
  //
  //   // add evnet name
  //   // Hint: socket.on('event_name', ....
  //   array.add("event_name");
  //
  //   // add payload (parameters) for the event
  //   JsonObject param1 = array.createNestedObject();
  //   param1["now"] = (uint32_t) now;
  //
  //   // JSON to String (serializion)
  //   String output;
  //   serializeJson(doc, output);
  //
  //   // Send event
  //   socketIO.sendEVENT(output);
  //
  //   // Print JSON for debugging
  //   USE_SERIAL.println(output);
  // }
}
