// Essential library
#include <Arduino.h>

#include <WiFi.h>
#include <HTTPClient.h>

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

int sortedSetpoint[] = {1, 2, 3};
int filterSetpoint[] = {0, 1, 2};

int isReady = 0;
int isRinging = 0;

#define SCREEN_ADRESS 0x3D
#define CLOCK_ADRESS 0x3D

// I2C Library
#include <Wire.h>

#include <Adafruit_I2CDevice.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <RTClib.h>

Adafruit_SSD1306 display(128, 64, &Wire, -1);

RTC_DS1307 rtc;

Timer<2> task;

String httpGet(String url) {
  HTTPClient http;
  http.begin(url.c_str());
  int httpResponse = http.GET();

  String payload = "0";

  if(httpResponse > 0) {
    payload = http.getString();
  } else {
    USE_SERIAL.printf("HTTP Request Failed: %d", httpResponse);
  }

  http.end();

  return payload;
}

void writeDisplay(String text) {
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.println(text);
  display.display();
}

void writeDisplay(int x, int y, String text) {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(x, y);
  display.println(text);
  display.display();
}

bool auth() {
  // creat JSON message for Socket.IO (event)
  DynamicJsonDocument doc(512);
  JsonArray array = doc.to<JsonArray>();

  // add event name
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

void sortSetpoint() {
  int size = 3;
  int a[size] = {filterSetpoint[0], filterSetpoint[1], filterSetpoint[2]};
  sortedSetpoint[0] = 1;
  sortedSetpoint[1] = 2;
  sortedSetpoint[2] = 3;

  // USE_SERIAL.println("Unsorted Array:");
  // for(int i = 0; i<size; i++) {
  //   USE_SERIAL.print(i);
  //   USE_SERIAL.print(" ");
  //   USE_SERIAL.print(filterSetpoint[i]);
  //   USE_SERIAL.print(" ");
  //   USE_SERIAL.print(sortedSetpoint[i]);
  //   USE_SERIAL.println("");
  // }

  for(int i = 0; i<(size-1); i++) {
    for(int o = 0; o<(size-(i+1)); o++) {
      if(a[o] > a[o+1]) {
        int t = a[o];
        a[o] = a[o+1];
        a[o+1] = t;
        int m = sortedSetpoint[o];
        sortedSetpoint[o] = sortedSetpoint[o+1];
        sortedSetpoint[o+1] = m;
      }
    }
  }

  // USE_SERIAL.println("Sorted Array:");
  // for(int i = 0; i<(size); i++) {
  //   USE_SERIAL.print(a[i]);
  //   USE_SERIAL.print(" ");
  //   USE_SERIAL.print(i);
  //   USE_SERIAL.print(" ");
  //   USE_SERIAL.print(filterSetpoint[i]);
  //   USE_SERIAL.print(" ");
  //   USE_SERIAL.print(sortedSetpoint[i]);
  //   USE_SERIAL.println(" ");
  // }
}

void syncTime() {
  // Time sync
  int serverTime = httpGet("http://showcase.api.linx.twenty57.net/UnixTime/tounix?date=now").toInt();

  if(serverTime > 0) {
    // rtc.adjust(serverTime * 1000); // Multiply with 1000 for millis format
    rtc.adjust(serverTime);
  } else {
    USE_SERIAL.printf("Sync time failed.");
  }
}

void listenConfig(uint8_t * payload, size_t length) {
  DynamicJsonDocument doc(512);
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
    lvl3[1] = getValue(data["lvl3"]["time"], ':', 1);

    filterSetpoint[0] = lvl1[0] + lvl1[1];
    filterSetpoint[1] = lvl2[0] + lvl2[1];
    filterSetpoint[2] = lvl3[0] + lvl3[1];

    sortSetpoint();
    syncTime();

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

  // Alarm logic
  DateTime raw = rtc.now();
  int now = raw.hour() + raw.minute();

  for(int i = 0; i<3; i++) {
    if(now > filterSetpoint[i]) {
      isRinging = 1;
      break;
    }
  }

  return true;
}

void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);

  if(!display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADRESS)){
    USE_SERIAL.printf("Screen not found.");
  }

  bool rtcReady = rtc.begin();
  if(!rtcReady) {
    USE_SERIAL.printf("RTC not found.");
  }

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

  // disable AP
  if(WiFi.getMode() & WIFI_AP) {
    WiFi.softAPdisconnect(true);
  }

  WiFi.mode(WIFI_STA);

  WiFi.disconnect();

  writeDisplay(0, 0, "Connecting to:");
  writeDisplay(0, 2, ssid);
  writeDisplay("...");

  WiFi.begin(ssid, pass);
  while(WiFi.status() != WL_CONNECTED) {
    delay(100);
  }

  String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

  writeDisplay("OK");
  writeDisplay(0, 4, "IP:");
  writeDisplay(ip.c_str());

  // server address, port and URL
  socketIO.begin(host, port);

  // event handler
  socketIO.onEvent(socketIOEvent);

  task.every(500, mechanic);

  if(rtcReady) {
    if(!rtc.isrunning()) {
      USE_SERIAL.printf("RTC not running,");
    }
    syncTime();
  }

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
