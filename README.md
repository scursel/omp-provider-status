# omp-provider-status

An [OMP (oh-my-pi)](https://github.com/can1357/oh-my-pi) extension that shows the **active provider** in the TUI status line.

OMP has no built-in provider segment — the `model` segment renders only the model name. This extension publishes the provider id as an extension status, which the `status` segment renders inline:

```
… · DeepSeek V4.1 Flash 1017 · max · mistral · ~/code · main · 01a1c6a1
                                 ^^^^^^^
```

## Install

1. Copy the extension into your OMP extensions directory:

```sh
cp provider-status.ts ~/.omp/agent/extensions/
```

2. Enable the `status` segment in `~/.omp/agent/config.yml`:

```yaml
statusLine:
  preset: custom          # required: explicit segment lists are ignored for other presets
  showHookStatus: false   # otherwise the same statuses render again below the bar
  leftSegments: [pi, vim, hostname, model, status, mode, path, git, pr, session, subagents]
  rightSegments: [session_name, token_in, token_out, cache_read, cache_write, token_rate, cache, cost, context_pct, context_total, time_spent, time]
  separator: powerline
  segmentOptions:
    model: { showThinkingLevel: true }
    path: { abbreviate: true, maxLength: 60 }
    git: { showBranch: true, showStaged: true, showUnstaged: true, showUntracked: true }
    time: { format: "24h", showSeconds: true }
```

The segment lists above mirror OMP's `nerd` preset; trim them to taste. `status` is the segment that renders statuses published with `ctx.ui.setStatus()`.

3. Restart OMP.

## How it works

`ctx.ui.setStatus("provider", ctx.model?.provider)` runs on:

- `session_start` — initial value
- `turn_start` — picks up `/model` switches at the next turn
- `retry_fallback_applied` — auto-retry fallback switches provider mid-turn

`model_select` is **not** an OMP event (it exists only in the pi fork), so it is intentionally not used.

## Notes

- In a **new** session, OMP lazily loads extensions whose factory registers no providers, shortcuts, composer shapes, or file fallbacks: the status appears after the first submitted input. Resumed sessions (`omp -c`, `omp --resume`) load the extension before the session starts.
- The `status` segment joins every extension status, dot-separated. If another extension publishes one, both appear.

## License

MIT — see [LICENSE](LICENSE).
