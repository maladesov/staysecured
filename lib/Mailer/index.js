const nodemailer = require('nodemailer');
// подключаем логгер Mailer
const Logger = require('../Logger');
const log = new Logger(api_config.logger, 'Mailer');

class MailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: api_config.mailer.host,
      port: api_config.mailer.port,
      secure: api_config.mailer.secure,
      auth: {
        user: api_config.mailer.user,
        pass: api_config.mailer.password,
      },
    });
  }

  async sendActivationMail(to, link) {
    if (!api_config.mailer.enabled) {
      return log.info(
        'Невозможно отправить сообщение, т.к почтовый сервис отключен в конфиге!'
      );
    }

    await this.transporter.sendMail({
      from: api_config.mailer.user,
      to,
      subject: 'Активация аккаунта',
      text: '',
      html: `
            <div>
                <h1>Для активации перейдите по ссылке</h1>
                <a href = ${link}>${link}</a>
            </div>
            `,
    });
  }
}

module.exports = new MailService();