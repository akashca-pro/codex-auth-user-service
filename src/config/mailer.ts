import nodemailer from 'nodemailer';
import { config } from '@/config';

export const mailer = nodemailer.createTransport({
  service: config.NODEMAILER_SERVICE,
  auth: {
    user: config.NODEMAILER_EMAIL,
    pass: config.NODEMAILER_PASS,
  },
});
