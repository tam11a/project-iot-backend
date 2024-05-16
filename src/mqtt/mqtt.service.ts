import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient } from 'mqtt';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MqttService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  clientId: string;
  mqttClient: MqttClient;
  sensorPattern = /sensor\/([^/]+)\/live/;
  switchActionPattern = /switch\/([^/]+)\/action/;
  switchResponsePattern = /switch\/([^/]+)\/response/;

  onModuleInit() {
    this.clientId = `iot101-server-${process.env.NODE_ENV ?? 'development'}`;
    this.mqttClient = connect(
      process.env.MQTT_BROKER ?? 'mqtt://127.0.0.1:1883',
      {
        clientId: this.clientId,
        clean: true,
        connectTimeout: 4000,
        keepalive: 1000,
        // username: this.configService.get<string>('username'),
        // password: this.configService.get<string>('password'),
        reconnectPeriod: 1000,
        will: {
          topic: `offline/server/${process.env.NODE_ENV ?? 'development'}`,
          payload: Buffer.from(this.clientId),
        },
      },
    );

    this.mqttClient.on('connect', () => {
      console.info(
        'Connected to:',
        process.env.MQTT_BROKER ?? 'mqtt://127.0.0.1:1883',
      );
      this.mqttClient.publish(
        `online/server/${process.env.NODE_ENV ?? 'development'}`,
        this.clientId,
      );
    });

    // this.mqttClient.listeners('connect')

    this.mqttClient.on('error', function () {
      console.error(
        'Error in connecting to MQTT Broker (',
        process.env.MQTT_BROKER ?? 'mqtt://127.0.0.1:1883',
        ')',
      );
    });

    this.mqttClient.subscribe(
      [`sensor/+/live`, `switch/+/action`, `switch/+/response`],
      async (err) => {
        if (err) {
          console.error(err);
          return;
        }
      },
    );

    this.mqttClient.on(`message`, (topic, payload, packet) => {
      // Store if New packet.retain
      try {
        if (topic.match(this.sensorPattern) && !packet.retain) {
          const sensorId = parseInt(topic.match(this.sensorPattern)?.[1]);
          const payload_extract = JSON.parse(payload.toString());
          if (sensorId === payload_extract.ref)
            this.onSensorData(
              sensorId,
              payload_extract.temp,
              payload_extract.hum,
            );
        }
      } catch (err) {
        console.error(err);
        return;
      }
    });
  }

  async onSensorData(sensor_id: any, temperature: number, humidity: number) {
    await this.prisma.sensorData.create({
      data: {
        sensor: {
          connect: {
            id: sensor_id,
          },
        },
        temperature,
        humidity,
      },
    });
    console.log(
      `Sensor # ${sensor_id} -> Temperature: ${temperature}, Humidity: ${humidity}`,
    );
  }
}
