/* eslint-disable no-inner-declarations, no-nested-ternary, no-sequences, no-unused-vars */

function files() {
  return [
    "<p><strong>Available files on this terminal:</strong></p>",
    "<pre>audit prep\nFile B\nFile C\nFile D</pre>"
  ];
}

function read(args) {
  if (args.length === 0) {
    return "<p>Please specify a file to read. Example: <code>Read File A</code></p>";
  }

  const fileName = args.join(" ").toLowerCase();

  const fileContents = {
    "file a": "<p><strong> audit prep:</strong> > Note: For internal use only – do not circulate externally

17 near-miss incidents (up from 9 last quarter)

Crew fatigue remains high. Formal rotation request pending Roylott sign-off.

Recurring mechanical stress on Winch Assembly B3 – recommend partial shut-down during night cycle.

Multiple unverified reports of “harmonic tremors” in substructure. Likely due to deep-water pressure and overclocked drills.</p>",
    "file b": "<p><strong>File B:</strong> Surveillance data - Restricted access.</p>",
    "file c": "<p><strong>File C:</strong> Personnel records summary.</p>",
    "file d": "<p><strong>File D:</strong> Emergency contact protocols.</p>"
  };

  return fileContents[fileName] || `<p>No such file found: <strong>${args.join(" ")}</strong></p>`;
}

function search(args) {
  const keyword = args.join(' ').toLowerCase();

  // Empty search index (no public searchable terms for now)
  const results = {};

  for (const [key, output] of Object.entries(results)) {
    if (keyword.includes(key)) {
      return output;
    }
  }

  return "<p>No results found for keyword: <strong>" + keyword + "</strong></p>";
}

function help(args) {
  return `
<p>You can read the help of a specific command by entering as follows: <code>'help commandName'</code></p>
<p><strong>List of useful commands:</strong></p>
<pre>
clear   date   exit   help   mail
</pre>
<p>You can navigate in the commands usage history using the UP & DOWN arrow keys.</p>
<p>The TAB key will provide command auto-completion.</p>
`;
}

function decrypt(args) {
  if (args.length === 0) {
    return "<p>Some encrypted text must be provided: <code>decrypt 53CR3T T3XT</code></p>";
  }
  const textInClear = rot13(args.join(" "));
  return `<p class="hack-reveal">${textInClear}</p>`;
}

function rot13(s) {
  return s.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode((c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13) ? c : c - 26)
  );
}

function identify() {
  const introMsg = ["What is this?", `<img src="https://thisartworkdoesnotexist.com/?${performance.now()}" style="width: 10rem; max-width: 100%;">`];
  return {
    message: introMsg,
    onInput(answer) {
      return `Wrong! This is not "${answer}"`;
    }
  };
}

function artifact(args) {
  if (args.length === 0) {
    return [
      "<p>An ID must be provided: <code>artifact $id</code></p>",
      `You currently have access to the following artifacts: ${Object.keys(DWEETS).join(" ")}`
    ];
  }
  const artifactId = args[0];
  const artifactDweet = DWEETS[artifactId];
  if (!artifactDweet) {
    return `You do not have access to the artifact with ID ${artifactId}`;
  }
  return artifactDweet();
}

const DWEETS = {
  888: () => dweet((t, x) => {
    for (let i = 0; i < 300; i++) {
      for (let j = 0; j < 6; j++) {
        x.fillRect(100 + 66 * C(i) * S(T(t / 1.1) + j / i), 100 + 66 * S(i), 2, 2);
      }
    }
  }),
  1829: () => dweet((t, x) => {
    for (let i = 16; i--;) {
      x.ellipse(100 + 60 * S(t + i * 0.1), 100 + 10 * C(t + i * 0.1), 32 * S(-i * 0.5) + 32, 10 * S(i * 0.1) + 1, 1.6 + 0.5 * S(t * 0.5), 9.5, 0, true);
    }
    x.stroke();
  }),
  // (You can retain or remove these DWEETS if you're not using the `artifact` command)
};

