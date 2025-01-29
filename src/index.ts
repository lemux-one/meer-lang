type Token = {
  type: 'str' | 'word' | 'kw'
  value: string
}

function tokenize(input: string): Token[] {
  const tokens: Token[] = []
  const words = input.split(' ').map((token) => token.trim())
  for (const word of words) {
    if (word.startsWith("'") && word.endsWith("'")) {
      tokens.push({ type: 'str', value: word.slice(1, -1) })
    } else if (word.endsWith(':')) {
      tokens.push({ type: 'kw', value: word.slice(0, -1) })
    } else tokens.push({ type: 'word', value: word })
  }
  return tokens
}

const lookup = {
  Rt: {
    exit: () => process.exit(0),
  },
}
function execute(tokens: Token[]) {
  const [receiver, action] = tokens
  if (!receiver || !action) {
    console.error('Malformed message')
    return
  }
  const receiverObj = lookup[receiver.value]
  if (!receiverObj) {
    console.error('Unknown receiver: ', receiver.value)
    return
  }
  const actionFn = receiverObj[action.value]
  if (!actionFn) {
    console.error('Unknown action: ', action.value)
    return
  }
  actionFn()
}

export async function repl() {
  let tokens: Token[] = []
  for await (const line of console) {
    tokens = tokenize(line)
    execute(tokens)
  }
}
