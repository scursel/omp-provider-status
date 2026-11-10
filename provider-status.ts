import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

/**
 * Publishes the active provider id as a status-line segment.
 *
 * OMP has no built-in provider segment: the `model` segment renders only the
 * model name. This sets an extension status ("provider"), which the `status`
 * segment renders inline when it is listed in statusLine.leftSegments or
 * rightSegments (requires statusLine.preset: custom).
 */
export default function providerStatus(pi: ExtensionAPI) {
	pi.on("session_start", async (_event, ctx) => {
		ctx.ui.setStatus("provider", ctx.model?.provider);
	});

	// `/model` switches and retry fallbacks: refresh at the next turn.
	pi.on("turn_start", async (_event, ctx) => {
		ctx.ui.setStatus("provider", ctx.model?.provider);
	});

	// Auto-retry can switch provider mid-turn, before the next turn_start.
	pi.on("retry_fallback_applied", async (_event, ctx) => {
		ctx.ui.setStatus("provider", ctx.model?.provider);
	});
}
