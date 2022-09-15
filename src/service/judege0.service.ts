import axios from "axios";
/**
 * Sends Code to Judge0API
 * @param  {string} code - code that needs to be run
 * @param  {number} language - language id
 * @param  {string} expectedOutput - expected output
 * @param  {string} input - input for the code
 * @returns token
 */
export async function sendCode(code: string, language: number, expectedOutput: string, input?: string) {
    code = Buffer.from(code).toString("base64");
    const base64 = true; 
    const url = `${process.env.JUDGE0_URL}/submissions?base64_encoded=${base64}`;
    const data = {
        source_code: code,
        language_id: language,
        expected_output: expectedOutput,
        stdin: input
    };
    const response = await axios.post(url, data);
    return response.data.token;
}
/**
 * gets Data from Judge0 API
 * @param  {string} token - token from judge api
 */

export async function getSubmissionData(token: string) {
    const base64 = true;
    const url = `${process.env.JUDGE0_URL}/submissions/${token}?base64_encoded=${base64}`;
    const response = await axios.get(url);
    const compile_output = response.data.compile_output.replace(/\\n/g, "");
    let data = {
        stdout: response.data.stdout,
        time: response.data.time,
        memory: response.data.memory,
        token: response.data.token,
        // base64 encoded to decode
        compile_output: Buffer.from(compile_output, "base64").toString("ascii"),
        message: response.data.message,
        status: {
            description: response.data.status.description,
            id: response.data.status.id
        }
    }
    return data;
}
