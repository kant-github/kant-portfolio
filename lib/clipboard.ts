function copyWithSelection(text: string) {
	const field = document.createElement("textarea");

	field.value = text;
	field.setAttribute("readonly", "");
	field.style.position = "fixed";
	field.style.top = "0";
	field.style.opacity = "0";

	document.body.appendChild(field);
	field.select();

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
