/* eslint-disable no-inner-declarations, no-nested-ternary, no-sequences, no-unused-vars */

function files() {
  return `
    <p><strong>Available files on this terminal:</strong></p>
    <pre>none</pre>
  `;
}

function read(args) {
  return "<p>No readable files are currently stored on this terminal.</p>";
}

function dive(args) {
  const lines = [];
  const maxDepth = 1000;
  const step = 100;

  for (let depth = step; depth <= maxDepth; depth += step) {
    lines.push(`<p>Diving — Depth: <span class="dim">${depth}m</span></p>`);
  }

  lines.push(`<p><span class="dim">Seabed reached.</span></p>`);
  lines.push(`<p><span class="dim">Initialising camera...</span></p>`);

  const videoHTML = `
    <div style="margin-top: 10px">
      <video width="640" height="360" controls autoplay muted loop>
        <source src="https://github.com/SectionNET/ROV-CTRL/blob/master/config/network/fortudo/VHS_20250506_14331100_VP9.webm" type="video/webm">
        Your browser does not support the video tag.
      </video>
    </div>
  `;

  return new Promise((resolve) => {
    output({ text: lines, delayed: 500 }).then(() => {
      setTimeout(() => resolve(videoHTML), 1000);
    });
  });
}

function search(args) {
  return `<p>No results found for keyword: <strong>${args.join(" ")}</strong></p>`;
}

function help(args) {
  return `
<p>You can read the help of a specific command by entering as follows: <code>'help commandName'</code></p>
<p><strong>List of useful commands:</strong></p>
<pre>
clear   date   exit   help   files   read   dive
</pre>
<p>You can navigate in the commands usage history using the UP & DOWN arrow keys.</p>
<p>The TAB key will provide command auto-completion.</p>`;
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
  const introMsg = [
    "What is this?",
    `<img src="https://thisartworkdoesnotexist.com/?${performance.now()}" style="width: 10rem; max-width: 100%;">`
  ];
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
      x.ellipse(
        100 + 60 * S(t + i * 0.1),
        100 + 10 * C(t + i * 0.1),
        32 * S(-i * 0.5) + 32,
        10 * S(i * 0.1) + 1,
        1.6 + 0.5 * S(t * 0.5),
        9.5,
        0,
        true
      );
    }
    x.stroke();
  })
};
