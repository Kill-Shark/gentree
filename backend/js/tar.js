/*
 * tar.js
 */

export const FILE = 0
export const DIR = 5

export class TarEntry {
	constructor(type, name, data) {
		this.type = type
		this.name = name
		this.data = data
	}
}

export function tar_load(tar, file) {
	let i = 0
	while (true) {
		if (file.length - i < 512 || file[i] == 0)
			break

		let chksum = String.fromCharCode(...file.slice(i + 148, i + 154))
		chksum = parseInt(chksum, 8)

		for (let k = 148; k < 156; k++)
			file[i + k] = 0x20

		for (let k = 0; k < 512; k++)
			chksum -= file[i + k]

		if (chksum != 0)
			return "Wrong checksum"

		let e = new TarEntry()

		e.name = []
		for (let k = 0; k < 100; k++) {
			if (file[i + k] == 0)
				break
			e.name.push(file[i + k])
		}

		if (e.name[e.name.length - 1] == 0x2F)
			e.name = e.name.slice(0, e.name.length - 1)

		e.name = String.fromCharCode(...e.name)

		let size = String.fromCharCode(...file.slice(i + 124, i + 135))
		size = parseInt(size, 8)

		e.mtime = parseInt(String.fromCharCode(...file.slice(i + 136, i + 147)), 8)

		e.type = parseInt(String.fromCharCode(file[i + 156]))

		i += 512

		if (e.type == FILE) {
			e.data = file.slice(i, i + size)
			i += size
			if (size < 512)
				i += 512 - size
			else
				i += 512 - (size % 512)
		}

		tar.push(e)
	}
}

export function tar_save(tar, file) {
	;
}
