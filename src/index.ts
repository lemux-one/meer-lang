export async function repl() {
  for await (const line of console) {
    console.log(line)
  }
}
