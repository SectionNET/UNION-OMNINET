/* eslint-disable no-inner-declarations, no-nested-ternary, no-sequences, no-unused-vars */

function files() {
  return Promise.resolve(`
    <p><strong>Available files on this terminal:</strong></p>
    <pre>shift_reports
team_roster
message_draft</pre>
  `);
}

function read(args) {
  if (!args || args.length === 0) {
    return Promise.resolve("<p>Please specify a file to read. Example: <code>read file name</code></p>");
  }

  const fileName = args.join(" ").toLowerCase();

  const fileContents = {
    "shift_reports": `<p><strong>shift_reports</strong><br>
&gt;Daily_Report_FEB05.txt<br><br>
Ops Status: Nominal<br>
Weather: Overcast, 18–23kt winds.<br><br>
<span class="desync">Notable Issues:</span><br>
Kitchen freezer #3 compressor failed again. Boris scavenged parts from a backup unit.<br>
Stahl requested security drills for crew. Still won’t explain what he expects to happen.<br>
McCrae reported dizziness near crane deck—Dr. Kent cleared him, but still odd.</p>`,

    "team_roster": `<p><strong>FORTUDO ENERGY – DEVIL’S HOLE PLATFORM</strong><br>
<pre>
| Name              | Role                      | Shift        | Bunk No.   | Comments                                |
|-------------------|---------------------------|--------------|------------|------------------------------------------|
| Fiona McCraig     | Control Systems Operator  | Night        | C-12       | Dizzy spell last week. Watch closely.    |
| Richard Copper    | Crane operator            | Day          | B-3        | Nose broken in mess.                     |
| Vance Norris      | Security                  | Night        | D-4        | Temper problem. Avoid conflict.          |
| Teagan Fielding   | Stores Manager            | Split        | C-2        | Burnout showing. Sleep pattern erratic.  |
| Patrick Murphy    | Catering                  | Day          | C-5        | Hears “mechanical voices.” Needs break.  |
| Nigel Gordon      | Security (Audit Team)     | Day          | D-6        | Quiet. Keeps detailed notes.             |
| Gabe MacCready    | Radio Operator            | Night        | A-2        | Loyal to Roylott. Very protective.       |
| David Stahl       | Head of Security          | Split        | A-1        | Keeps locking door from inside.          |
| Rachel Kent       | Nuclear Ops Engineer      | Day          | B-7        | “Fine” lately. Too fine.                 |
| Piers Goldman     | Ops Coordinator           | Split        | Admin Suite| Avoids decisions. Desk clutter = warning.|
| Harry Slocum      | Maintenance               | Day          | B-8        | Requests more time off.                  |
| Cerys Jones       | Reactor Control           | Day/Night    | C-8        | Storms make her twitchy.                 |
| Audit Team        | External Delegation       | Variable     | Guest-2A/B | Friendly but nosy. Stahl doesn’t trust.  |
</pre></p>`,

    "message_draft": `<p><strong>Message_Draft_UNSENT:</strong><br>
To: Piers Goldman<br>
Subject: Support Staff Burnout<br><br>
Piers,<br>
I know you're dealing with Roylott, but I have to say it again: the maintenance team is at breaking point. Alvarez was crying in the stairwell. Boulos hasn’t taken a proper sleep cycle in five days.<br><br>
You keep saying to “hold the line.” I'm trying. But we’re running on duct tape and stubbornness.<br><br>
—Angie</p>`
  };

  return Promise.resolve(fileContents[fileName] || `<p>No such file found: <strong>${args.join(" ")}</strong></p>`);
}

function search(args) {
  const keyword = args.join(' ').toLowerCase();
  const results = {}; // Empty index
  for (const [key, output] of Object.entries(results)) {
    if (keyword.includes(key)) return output;
  }
  return `<p>No results found for keyword: <strong>${keyword}</strong></p>`;
}

function help(args) {
  return `
<p>You can read the help of a specific command by entering as follows: <code>'help commandName'</code></p>
<p><strong>List of useful commands:</strong></p>
<pre>
clear   date   exit   help   mail   files   read
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

