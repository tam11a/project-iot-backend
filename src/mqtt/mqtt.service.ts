import { Injectable, OnModuleInit } from '@nestjs/common';
import { connect, MqttClient, Packet } from 'mqtt';

@Injectable()
export class MqttService implements OnModuleInit {
  mqttClient: MqttClient;

  onModuleInit() {
    this.mqttClient = connect('mqtt://127.0.0.1:1883', {
      clean: true,
      connectTimeout: 4000,
      // username: this.configService.get<string>('username'),
      // password: this.configService.get<string>('password'),
      reconnectPeriod: 1000,
    });

    this.mqttClient.on('connect', function (hello: Packet) {
      console.info('Connected to CloudMQTT', hello);
    });

    // this.mqttClient.listeners('connect')

    this.mqttClient.on('error', function () {
      console.error('Error in connecting to CloudMQTT');
    });
  }
}
