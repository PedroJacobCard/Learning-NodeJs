import Mail from '../../lib/Mail';

class WelcomeEmailJob {
  get key() {
    return 'WelcomeEmailJob';
  }

  async handle({ data }) {
    const { email, name } = data;

    Mail.send({
      to: email,
      subject: 'Welcome!',
      text: `Welcome to our App, ${name}!`,
    });
  }
}

export default new WelcomeEmailJob();
