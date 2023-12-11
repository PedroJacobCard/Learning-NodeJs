class DummyJob {
  get key() {
    return 'dummy';
  }

  async handle({ data }) {
    const { message } = data;

    console.log(message);
  }
}

export default new DummyJob();
