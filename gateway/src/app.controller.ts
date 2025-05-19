import { Controller, All, Req, Res, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { Request, Response } from 'express';

@Controller()
export class AppController {
  constructor(private http: HttpService) {}
  private logger = new Logger();

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    const [_, service, ...rest] = req.url.split('/');

    const serviceMap = {
      auth: 'http://auth-service:3000',
      event: 'http://event-service:3000',
      reward: 'http://event-service:3000',
      rewardRequest: 'http://event-service:3000',
    };

    const baseUrl = serviceMap[service];
    if (!baseUrl) return res.status(404).send({ message: 'Unknown service' });

    const fullUrl = `${baseUrl}/${[service, ...rest].join('/')}`;

    this.logger.log({ fullUrl: fullUrl });
    this.logger.log({ method: req.method });
    this.logger.log({ headers: req.headers });
    this.logger.log({ data: req.body });
    this.logger.log({ params: req.query });

    const unsafeHeaders = [
      'host',
      'connection',
      'content-length',
      'accept-encoding',
    ];

    const proxyHeaders = Object.fromEntries(
      Object.entries(req.headers).filter(
        ([key]) => !unsafeHeaders.includes(key.toLowerCase()),
      ),
    );
    try {
      const response = await lastValueFrom(
        this.http.request({
          url: fullUrl,
          method: req.method as any,
          headers: proxyHeaders,
          data: req.body,
          params: req.query,
        }),
      );
      res.status(response.status).send(response.data);
    } catch (err) {
      res
        .status(err.response?.status || 500)
        .send(err.response?.data || { message: 'Proxy Error' });
    }
  }
}
