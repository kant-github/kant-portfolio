// execCommand is deprecated, but it is still the only path that works when
// navigator.clipboard is missing (any page served over plain http that is not
// localhost) or when the clipboard permission is refused.
function copyWithSelection(text: string) {
	const field = document.createElement("textarea");

	field.value = text;
	field.setAttribute("readonly", "");
	field.style.position = "fixed";
	field.style.top = "0";
	field.style.opacity = "0";
	field.style.pointerEvents = "none";

	document.body.appendChild(field);

	field.select();
	// iOS Safari ignores select() on a readonly field.
	field.setSelectionRange(0, text.length);

	const copied = document.execCommand("copy");
	document.body.removeChild(field);

	return copied;
}

export async function copyText(text: string) {
	try {
		await navigator.clipboard.writeText(text);
		return true;
	} catch {
		try {
			return copyWithSelection(text);
		} catch {
			return false;
		}
	}
}
