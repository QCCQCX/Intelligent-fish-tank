#include <aJSON.h>
#include <Servo.h>
Servo myservo;

#include <OneWire.h>
#include <DallasTemperature.h>
// Data wire is plugged into port 2 on the Arduino
#define ONE_WIRE_BUS 8
// Setup a oneWire instance to communicate with any OneWire devices (not just Maxim/Dallas temperature ICs)
OneWire oneWire(ONE_WIRE_BUS);
// Pass our oneWire reference to Dallas Temperature. 
DallasTemperature sensors(&oneWire);

//=============  此处必须修改============
String DEVICEID = "28951"; // 你的设备ID=======
String APIKEY = "71ab2490b"; // 设备密码==
String INPUTID1 = "25504"; //接口1
String INPUTID2 = "25505";//接口2
String INPUTID3 = "25506";//接口3
String INPUTID4 = "25507";//接口4
String INPUTID5 = "25508";//接口5

//=======================================
unsigned long lastCheckStatusTime = 0; //记录上次报到时间
unsigned long lastCheckInTime = 0; //记录上次报到时间
unsigned long lastUpdateTime = 0;//记录上次上传数据时间
const unsigned long postingInterval = 40000; // 每隔40秒向服务器报到一次
const unsigned long updateInterval = 5000; // 数据上传间隔时间5秒
unsigned long checkoutTime = 0;//登出时间
//=======================================
int relayPin = 9; // 继电器引脚 加热
float temperature = 18;
//=======================================
int relayPin_water_1 = 2; // 继电器引脚 进水泵

int relayPin_water_2 = 3; // 继电器引脚 出水泵

int watering = 0;  // 换水状态
//=======================================
int relayPin_air = 4; // 继电器引脚 气泵
int auto_air = 0; 

int time_air = 5;
unsigned long time_2 = 0;
int airing = 0;
//=======================================
const int Trig1 = 7;                           // 设定SR04连接的Arduino引脚
const int Echo1 = 6; 
double distance1,time1 ; 
//=======================================
int auto_eat = 0;  // 投喂
int time_eat = 5;
unsigned long time_1 = 0;
int eating = 0;

void setup() {
  Serial.begin(115200);
  delay(5000);//等一会儿ESP8266
    // Start up the library
  sensors.begin();
  pinMode(relayPin, OUTPUT);
  pinMode(relayPin_water_1, OUTPUT);
  pinMode(relayPin_water_2, OUTPUT);
  pinMode(relayPin_air, OUTPUT);
     
  // Set to LOW so no power flows through the sensor
  digitalWrite(relayPin, HIGH);
  digitalWrite(relayPin_water_1, HIGH);
  digitalWrite(relayPin_water_2, HIGH);
  digitalWrite(relayPin_air, HIGH);

  pinMode(Trig1, OUTPUT); 
  pinMode(Echo1, INPUT);

  myservo.attach(5);
  myservo.write(0); 
  
  checkIn();
}
void loop() {
  //每一定时间查询一次设备在线状态，同时替代心跳
  if (millis() - lastCheckStatusTime > postingInterval) {
    checkStatus();
  }
  //checkout 50ms 后 checkin
  if ( checkoutTime != 0 && millis() - checkoutTime > 50 ) {
    checkIn();
    checkoutTime = 0;
  }
  //每隔一定时间上传一次数据
  if (millis() - lastUpdateTime > updateInterval) {
    float val1;//定义变量  水温
    int val2;//定义变量  水位
    int val3;//定义变量   
    int val4;//定义变量
    int val5;//定义变量
        
    sensors.requestTemperatures();            // 采集温度数据
    val1 = sensors.getTempCByIndex(0);  

    if(val1 < temperature){                      // 温控
      digitalWrite(relayPin, LOW);
    } else if (val1 >= temperature + 0.5) {
      digitalWrite(relayPin, HIGH);
    }

    if (watering == 1) {                 // 换水  
      open_water_2();  // 出水
      watering = 2;
    }
    else if (watering == 2) {
      digitalWrite(Trig1, LOW);                             
      delayMicroseconds(2);                                   
      digitalWrite(Trig1, HIGH);                               
      delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
      digitalWrite(Trig1, LOW);                                
      time1 = pulseIn(Echo1, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
      distance1 = time1 /58 ;                                  //计算出距离,输出的距离的单位是厘米cm
      if (distance1 > 6.6) {
        close_water_2();    // 停止出水
        delay(10);
        watering = 3;
      }
    }
    else if (watering == 3) {
        open_water_1();     // 进水
        watering = 4;
    }
    else if (watering == 4) {
      digitalWrite(Trig1, LOW);                             
      delayMicroseconds(2);                                   
      digitalWrite(Trig1, HIGH);                               
      delayMicroseconds(10);                                  //产生一个10us的高脉冲去触发SR04
      digitalWrite(Trig1, LOW);                                
      time1 = pulseIn(Echo1, HIGH);                              // 检测脉冲宽度，注意返回值是微秒us
      distance1 = time1 /58 ;                                  //计算出距离,输出的距离的单位是厘米cm
      if (distance1 <= 3) {
        close_water_1();    // 停止进水 
        watering = 0;
      }
    }

    if (auto_eat == 1) {               // 投喂
      if(millis() - time_1 >= time_eat * 1000 && eating == 0){
        myservo.write(90);
        eating = 1;
      } else if (eating == 1) {
        myservo.write(0);
        eating = 0;
        time_1 = millis();
      }
    }

    if (auto_air == 1) {               // 氧气
      if(millis() - time_2 >= time_air * 1000 && airing == 0){
        open_air();
        airing = 1;
      } else if (airing == 1) {
        close_air();
        airing = 0;
        time_2 = millis();
      }
    }

    val2 = eating;
    
    if (watering == 0) {
      val3 = 0;
    } else {
      val3 = 1;
    }
    
    val5 = airing;
    
    update(DEVICEID, INPUTID1, val1, INPUTID2, val2, INPUTID3, val3, INPUTID4, val4, INPUTID5, val5);    // 上传数据
    lastUpdateTime = millis();
  }
  //读取串口信息
  while (Serial.available()) {
    String inputString = Serial.readStringUntil('\n');
    // 打印收到的JSON字符串
    Serial.println("test_inputString:");
    Serial.println(inputString);
    // 接收下位机与中间件连接信息
    if(inputString.indexOf("WELCOME") != -1)
    {
      checkOut();
      checkoutTime = millis();
    }
    if(inputString.indexOf("connected") != -1)
    {
      checkIn();
    }
    if(inputString.indexOf("OPEN_WATER") != -1 && watering == 0) {
      watering = 1;
    }
    if(inputString.indexOf("EAT") != -1) {
      if(inputString.indexOf("EAT_THREE") != -1 && auto_eat == 0) {
        myservo.write(90);
        eating = 1;
      }
      else if(inputString.indexOf("EAT_FOUR") != -1 && auto_eat == 0) {
        myservo.write(0);
        eating = 0;
      }
      else if(inputString.indexOf("EAT_ONE") != -1) {
        auto_eat = 1;
        time_1 = millis();
        myservo.write(0);
        eating = 0;
      }
      else if(inputString.indexOf("EAT_TWO") != -1) {
        auto_eat = 0;
        myservo.write(0);
        eating = 0;
      }
      else if(inputString.indexOf("EAT_5") != -1 && auto_eat == 1) {
        time_eat = 5;
      }
      else if(inputString.indexOf("EAT_10") != -1 && auto_eat == 1) {
        time_eat = 10;
      }
      else if(inputString.indexOf("EAT_15") != -1  && auto_eat == 1) {
        time_eat = 15;
      }
    }
    if(inputString.indexOf("O_") != -1) {
      if(inputString.indexOf("O_THREE") != -1  && auto_air == 0) {
        open_air();
        airing = 1;
      }
      else if(inputString.indexOf("O_FOUR") != -1 && auto_air == 0) {
        close_air();
        airing = 0;
      }
      else if(inputString.indexOf("O_ONE") != -1) {
        auto_air = 1;
        time_2 = millis();
        close_air();
        airing = 0;
      }
      else if(inputString.indexOf("O_TWO") != -1) {
        auto_air = 0;
        close_air();
        airing = 0;
      }
      else if(inputString.indexOf("O_5") != -1 && auto_air == 1) {
        time_air = 5;
      }
      else if(inputString.indexOf("O_10") != -1 && auto_air == 1) {
        time_air = 10;
      }
      else if(inputString.indexOf("O_15") != -1 && auto_air == 1) {
        time_air = 15;
      }
    }
    if(inputString.indexOf("TEMP") != -1) {
      if(inputString.indexOf("TEMP_18") != -1) {
        temperature = 18; 
      }
      else if(inputString.indexOf("TEMP_20") != -1) {
        temperature = 20; 
      }
      else if(inputString.indexOf("TEMP_22") != -1) {
        temperature = 22; 
      }
      else if(inputString.indexOf("TEMP_24") != -1) {
        temperature = 24;
      }
    }
  }
}
//设备登录
//{"M":"checkin","ID":"xx1","K":"xx2"}\n
void checkIn() {
  Serial.print("{\"M\":\"checkin\",\"ID\":\"");
  Serial.print(DEVICEID);
  Serial.print("\",\"K\":\"");
  Serial.print(APIKEY);
  Serial.print("\"}\n");
}
//强制设备下线，用消除设备掉线延时
//{"M":"checkout","ID":"xx1","K":"xx2"}\n
void checkOut() {
  Serial.print("{\"M\":\"checkout\",\"ID\":\"");
  Serial.print(DEVICEID);
  Serial.print("\",\"K\":\"");
  Serial.print(APIKEY);
  Serial.print("\"}\n");
}

//查询设备在线状态
//{"M":"status"}\n
void checkStatus() {
  Serial.print("{\"M\":\"status\"}\n");
  lastCheckStatusTime = millis();
}

void sayToClient(String client_id, String content) {
  Serial.print("{\"M\":\"say\",\"ID\":\"");
  Serial.print(client_id);
  Serial.print("\",\"C\":\"");
  Serial.print(content);
  Serial.print("\"}\r\n");
  lastCheckInTime = millis();
}
void update(String did, String inputid1, float value1, String inputid2, int value2, String inputid3, int value3,String inputid4, int value4,String inputid5, int value5) {
  Serial.print("{\"M\":\"update\",\"ID\":\"");
  Serial.print(did);
  Serial.print("\",\"V\":{\"");

  Serial.print(inputid1);
  Serial.print("\":\"");
  Serial.print(value1);
  Serial.print("\",\"");

  Serial.print(inputid2);
  Serial.print("\":\"");
  Serial.print(value2);
  Serial.print("\",\"");

  Serial.print(inputid3);
  Serial.print("\":\"");
  Serial.print(value3);
  Serial.print("\",\"");

  Serial.print(inputid4);
  Serial.print("\":\"");
  Serial.print(value4);
  Serial.print("\",\"");
  
  Serial.print(inputid5);
  Serial.print("\":\"");
  Serial.print(value5);
  Serial.println("\"}}");
}

 void open_water_1(){
  digitalWrite(relayPin_water_1, LOW);
}
 void close_water_1(){
  digitalWrite(relayPin_water_1, HIGH);
}
 void open_water_2(){
  digitalWrite(relayPin_water_2, LOW);
}
 void close_water_2(){
  digitalWrite(relayPin_water_2, HIGH);
}
 void open_air(){
  digitalWrite(relayPin_air, LOW);
}
 void close_air(){
  digitalWrite(relayPin_air, HIGH);
}
