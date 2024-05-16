import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient, Packet } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  clientId: string;
  mqttClient: MqttClient;

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
        // reconnectPeriod: 1000,
        will: {
          topic: `offline/server/${process.env.NODE_ENV ?? 'development'}`,
          payload: Buffer.from(this.clientId),
        },
      },
    );

    this.mqttClient.on('connect', (hello: Packet) => {
      console.info('Connected to CloudMQTT', hello);
      this.mqttClient.publish(
        `online/server/${process.env.NODE_ENV ?? 'development'}`,
        this.clientId,
      );
    });

    // this.mqttClient.listeners('connect')

    this.mqttClient.on('error', function () {
      console.error('Error in connecting to CloudMQTT');
    });
  }
}
