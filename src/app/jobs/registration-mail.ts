import Mail from 'app/services/mail'
import { Job } from '@interfaces/jobs.interface'
import { IDataMail } from '@interfaces/mail.interface'

class RegistrationMail implements Job {
  key = 'RegistrationMail'
  options = {}

  async handle({ data }: { data: IDataMail }): Promise<any> {
    const { user } = data

    await Mail.sendMail({
      from: process.env.MAIL_FROM,
      to: `${user.nickname} <${user.email}>`,
      subject: 'Game Lobby Registration',
      html: `Welcome ${user.nickname}, please confirm your registration...`,
    })
  }
}

export default new RegistrationMail()
