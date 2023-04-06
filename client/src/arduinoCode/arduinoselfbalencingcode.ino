#include <Wire.h>
#include <Adafruit_ADXL345_U.h>
#include <SoftwareSerial.h>
#include <Servo.h>

Servo myservo;
int M11 = 4, //Connect Motor 1 Blue wire To Pin #13 
 M12 = 5, //Connect Motor 1 Violet wire To Pin #12 
 M21 = 6, //Connect Motor 2 Blue wire To Pin #11
 M22 = 7; //Connect Motor 2 Violet wire To Pin #10 

Adafruit_ADXL345_Unified accel = Adafruit_ADXL345_Unified(12345);
SoftwareSerial BTserial(10, 11); // Setup of Bluetooth module on pins 10 (TXD) and 11 (RXD);

void setup() {
  BTserial.begin(9600);
  myservo.attach(3);
  pinMode(M11, OUTPUT); 
  pinMode(M12, OUTPUT); 
  pinMode(M21, OUTPUT); 
  pinMode(M22, OUTPUT);

    Serial.begin(9600);

 
  if (!accel.begin()) {
    Serial.println("Failed to initialize ADXL345 sensor!");
    while (1);
  }
}

void loop() {

  sensors_event_t event;
  accel.getEvent(&event);

  // Detect forward movement
  if (event.acceleration.x > 0.5) {
    myservo.write(180);  
     digitalWrite(M11, HIGH);
     digitalWrite(M12, LOW); 
     digitalWrite(M21, HIGH);
     digitalWrite(M22, LOW); 
 
  }
  
  // Detect backward movement
  else if (event.acceleration.x < -0.5) {
        myservo.write(0);  
  digitalWrite(M11, LOW);
     digitalWrite(M12, HIGH); 
     digitalWrite(M21, LOW);
     digitalWrite(M22, HIGH);
   
  }

  // Detect left movement
  else if (event.acceleration.y > 0.5) {
     digitalWrite(M11, LOW);
     digitalWrite(M12, LOW); 
     digitalWrite(M21, HIGH);
     digitalWrite(M22, LOW);

  }

  // Detect right movement
  else if (event.acceleration.y < -0.5) {
    digitalWrite(M11, HIGH);
     digitalWrite(M12, LOW); 
     digitalWrite(M21, LOW);
     digitalWrite(M22, LOW); 

  }

  // Stop the robot if no movement is detected
  else {
    digitalWrite(M11, LOW);
    digitalWrite(M12, LOW);
    digitalWrite(M21, LOW);
    digitalWrite(M22, LOW);

  }
  
  BTserial.print("start");
  BTserial.print(",");
  
    BTserial.print(event.acceleration.x);
     BTserial.print(",");
  
    BTserial.print(event.acceleration.y);
     BTserial.print(",");
  
    BTserial.print(event.acceleration.z);
     BTserial.print(",");
  
    BTserial.print("end");
         BTserial.print(",");
  
}