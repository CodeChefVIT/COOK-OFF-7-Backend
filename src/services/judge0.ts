import axios from "axios";
import wait from "wait";
class Judge0 {
  public static async sendCode(
    code: string,
    language: number,
    expectedOutput: string,
    input?: string,
    time?: number,
    memory?: number
  ) {
    expectedOutput = Buffer.from(expectedOutput).toString("base64");
    // code = Buffer.from(code).toString("base64"); // ? Only if the code is not base64 encoded
    const base64 = true;
    const url = `${process.env.JUDGE0_URL}/submissions?base64_encoded=${base64}`;
    const data = {
      "source_code": code,
      "language_id": language,
      "expected_output": expectedOutput,
      "memory_limit": "10000",
      "stdin": input
    };
    const response = await axios.post(url, data);
    return response.data.token;
  }
  public static async getSubmissionData(token: string) {
    const base64 = true;
    const url = `${process.env.JUDGE0_URL}/submissions/${token}?base64_encoded=${base64}`;
    let response = await axios.get(url);
    while (response.data.status.id === 1) {
      await wait(1000);
      response = await axios.get(url);
    }
    while (response.data.status.id === 2) {
      await wait(1000);
      response = await axios.get(url);
    }
    let compile_output = null;
    let message = null;
    console.log(response.data);
    if (response.data.message) message = response.data.message.replace(/\\n/g, ""); 
    if (response.data.compile_output) compile_output = response.data.compile_output.replace(/\\n/g, "");
    let stderr = null;
    let stdout = null;
    if (response.data.stderr) stderr = response.data.stderr.replace(/\\n/g, "");
    if (response.data.stdout) stdout = response.data.stdout.replace(/\\n/g, "");
    let data = {
      stdout: stdout ? Buffer.from(stdout, "base64").toString("ascii") : "",
      time: response.data.time,
      memory: response.data.memory,
      token: response.data.token,
      // base64 encoded to decode
      stderr: stderr ? Buffer.from(stderr, "base64").toString("ascii") : "",
      compile_output: compile_output ? Buffer.from(compile_output, "base64").toString("ascii") : "",
      message: message ? Buffer.from(message, "base64").toString("ascii") : "",
      status: {
        description: response.data.status.description,
        id: response.data.status.id,
      },
    };
    return data;
  }
}

export default Judge0;
