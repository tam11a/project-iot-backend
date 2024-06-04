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

  roomTogglePattern = /room\/([^/]+)\/toggle/;

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

    this.mqttClient.on('error', () => {
      console.error(
        'Error in connecting to MQTT Broker (',
        process.env.MQTT_BROKER ?? 'mqtt://127.0.0.1:1883',
        ')',
      );
      this.mqttClient.reconnect();
    });

    this.mqttClient.subscribe(
      [
        `sensor/+/live`,
        `switch/+/action`,
        `switch/+/response`,
        `room/+/toggle`,
      ],
      async (err) => {
        if (err) {
          console.error(err);
          return;
        }
      },
    );

    this.mqttClient.on(`message`, async (topic, payload, packet) => {
      // Store if New packet.retain
      try {
        if (topic.match(this.sensorPattern) && !packet.retain) {
          const sensorId = parseInt(topic.match(this.sensorPattern)?.[1]);
          const payload_extract = JSON.parse(payload.toString());
          console.log(
            `Sensor # ${sensorId} -> Temperature: ${payload_extract.temp}, Humidity: ${payload_extract.hum}`,
          );
          if (sensorId === payload_extract.ref)
            await this.onSensorData(
              sensorId,
              payload_extract.temp,
              payload_extract.hum,
            );
        } else if (topic.match(this.switchActionPattern) && !packet.retain) {
          const switchId = parseInt(topic.match(this.switchActionPattern)?.[1]);
          const payload_extract = JSON.parse(payload.toString());
          console.log(
            `Switch # ${switchId} -> Action: ${payload_extract.action}`,
          );
          this.mqttClient.publish(
            `switch/${switchId}/pending`,
            JSON.stringify({
              action: payload_extract.action,
            }),
          );
        } else if (topic.match(this.switchResponsePattern) && !packet.retain) {
          const switchId = parseInt(
            topic.match(this.switchResponsePattern)?.[1],
          );
          const payload_extract = JSON.parse(payload.toString());
          console.log(
            `Switch # ${switchId} -> Response: ${payload_extract.status}`,
          );
          await this.prisma.switchState.create({
            data: {
              switch: {
                connect: {
                  id: switchId,
                },
              },
              state: payload_extract.status,
              status: 'SUCCESS',
            },
          });
        } else if (topic.match(this.roomTogglePattern) && !packet.retain) {
          const roomId = parseInt(topic.match(this.roomTogglePattern)?.[1]);
          const payload_extract = JSON.parse(payload.toString());
          console.log(`Room # ${roomId} -> Toggle: ${payload_extract.toggle}`);
          await this.prisma.room.update({
            where: {
              id: roomId,
            },
            data: {
              remote_action: payload_extract.toggle,
            },
          });
        }
      } catch (err) {
        console.error(err);
        return;
      }
    });
  }

  async onSensorData(sensor_id: any, temperature: number, humidity: number) {
    console.log('onSensorData', sensor_id, temperature, humidity);
    try {
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
    } catch (err) {
      console.error(err);
    }
    console.log(
      `Sensor # ${sensor_id} -> Temperature: ${temperature}, Humidity: ${humidity}`,
    );
  }
}
