/*
 * node.js
 */

import {randint} from "./random.js"

import * as sym from "./sym.js"

export const HEIGHT = 5

export class Node {
	constructor(person) {
		this.person = person
		this.y = person.get_y()

		this.clear()

		this.parents = []
		this.mates = []
		this.children = []

		this.tx = undefined
		this.ty = undefined
		this.rx = undefined
		this.ry = undefined

		this.connections = [false, false, false, false]

		this.clear_hue()
	}

	clear() {
		this.x = undefined
		this.spreaded = false
		this.tensions_checked = false
	}

	clear_hue() {
		this.hue = undefined
	}

	connect(nodes) {
		for (let i in this.person.parents)
			this.parents.push(nodes[this.person.parents[i].id - 1])

		for (let i in this.person.mates)
			this.mates.push(nodes[this.person.mates[i].id - 1])

		for (let i in this.person.children)
			this.children.push(nodes[this.person.children[i].id - 1])
	}

	spread(nodes, w) {
		if (this.spreaded)
			return

		switch (randint(6)) {
		case 0:
			this.place_parents(nodes, w)
			this.place_mates(nodes, w)
			this.place_children(nodes, w)
			break

		case 1:
			this.place_parents(nodes, w)
			this.place_children(nodes, w)
			this.place_mates(nodes, w)
			break

		case 2:
			this.place_mates(nodes, w)
			this.place_parents(nodes, w)
			this.place_children(nodes, w)
			break

		case 3:
			this.place_mates(nodes, w)
			this.place_children(nodes, w)
			this.place_parents(nodes, w)
			break

		case 4:
			this.place_children(nodes, w)
			this.place_mates(nodes, w)
			this.place_parents(nodes, w)
			break

		case 5:
			this.place_children(nodes, w)
			this.place_parents(nodes, w)
			this.place_mates(nodes, w)
			break
		}

		this.spreaded = true

		switch (randint(6)) {
		case 0:
			this.spread_parents(nodes, w)
			this.spread_mates(nodes, w)
			this.spread_children(nodes, w)
			break

		case 1:
			this.spread_parents(nodes, w)
			this.spread_children(nodes, w)
			this.spread_mates(nodes, w)
			break

		case 2:
			this.spread_mates(nodes, w)
			this.spread_parents(nodes, w)
			this.spread_children(nodes, w)
			break

		case 3:
			this.spread_mates(nodes, w)
			this.spread_children(nodes, w)
			this.spread_parents(nodes, w)
			break

		case 4:
			this.spread_children(nodes, w)
			this.spread_mates(nodes, w)
			this.spread_parents(nodes, w)
			break

		case 5:
			this.spread_children(nodes, w)
			this.spread_parents(nodes, w)
			this.spread_mates(nodes, w)
			break
		}
	}

	spread_parents(nodes, w) {
		for (let i in this.parents)
			this.parents[i].spread(nodes, w)
	}

	spread_mates(nodes, w) {
		for (let i in this.mates)
			this.mates[i].spread(nodes, w)
	}

	spread_children(nodes, w) {
		for (let i in this.children)
			this.children[i].spread(nodes, w)
	}

	place_parents(nodes, w) {
		for (let i in this.parents) {
			let p = this.parents[i]
			if (p.person.sex == sym.MALE) {
				p.place(nodes, w, this.x, -(w / 2) - randint(w * 2))
			} else {
				p.place(nodes, w, this.x, w / 2 + randint(w * 2))
			}
		}
	}

	place_mates(nodes, w) {
		let inc = w + randint(w * 2)
		if (this.person.sex == sym.FEMALE)
			inc = -w

		for (let i in this.mates)
			this.mates[i].place(nodes, w, this.x, inc)
	}

	place_children(nodes, w) {
		for (let i in this.children)
			this.children[i].place(nodes, w, this.x, randint(w * 2))
	}

	place(nodes, w, x, mx) {
		if (this.x != undefined)
			return

		this.x = x
		if (randint(2))
			this.dodge(nodes, w, mx)
		else
			this.push(nodes, w, mx)
	}

	dodge(nodes, w, mx) {
		this.x += mx

		if (mx == 0)
			mx = w / 3.14

		for (let i = 0; i < nodes.length; i++) {
			if (nodes[i] == this || nodes[i].x == undefined)
				continue

			if (hit_test(this, nodes[i], w)) {
				this.x += mx
				i = -1
			}
		}
	}

	push(nodes, w, mx) {
		this.x += mx

		for (let i in nodes) {
			if (nodes[i] == this || nodes[i].x == undefined)
				continue

			if (hit_test(this, nodes[i], w)) {
				if (mx >= 0) {
					if (this.x < nodes[i].x) {
						nodes[i].push(nodes, w, w - (nodes[i].x - this.x))
					} else {
						nodes[i].push(nodes, w, w + (this.x - nodes[i].x))
					}
				} else {
					if (this.x < nodes[i].x) {
						nodes[i].push(nodes, w, -w - (nodes[i].x - this.x))
					} else {
						nodes[i].push(nodes, w, -w + (this.x - nodes[i].x))
					}
				}
			}
		}
	}

	get_tensions() {
		this.tensions_checked = true

		let tensions = []

		for (let i in this.mates) {
			let mate = this.mates[i]
			if (mate.tensions_checked)
				continue

			tensions.push(Math.abs(this.x - mate.x))
		}

		return tensions
	}

	get_covering(nodes, w) {
		let c = 0
		for (let i in this.mates) {
			let mid_x = (this.x + this.mates[i].x) / 2
			let mid_y = (this.y + this.mates[i].y) / 2
			for (let k in nodes)
				if (hit_test_point(nodes[k], w, mid_x, mid_y))
					c += 1
		}
		return c
	}

	get_hue() {
		if (this.hue != undefined)
			return this.hue

		if (this.parents.length == 0) {
			this.hue = randint(360)

		} else if (this.parents.length == 1) {
			this.hue = this.parents[0].get_hue()

		} else {
			this.hue = (this.parents[0].get_hue() - this.parents[1].get_hue()) % 360
		}

		return this.hue
	}

	get_jazz() {
		let diff = function(a, b) {
			let d = Math.abs(a - b)
			if (d > 180)
				d = 360 - d
			return d
		}

		let jazz = 0
		for (let i in this.mates)
			jazz += diff(this.hue, this.mates[i].hue)

		return jazz
	}

	get_root() {
		if (this.parents.length == 0)
			return undefined

		if (this.parents.length == 1) {
			this.parents[0].connections[2] = true
			return [this.parents[0].x, this.parents[0].y + HEIGHT / 2.4]
		}

		if (this.parents.length == 2) {
			let fx = this.parents[0].x
			let fy = this.parents[0].y
			let mx = this.parents[1].x
			let my = this.parents[1].y

			return [(fx + mx) / 2, (fy + my) / 2]
		}
	}
}

function hit_test(a, b, w) {
	if (Math.abs(a.x - b.x) < w &&
		Math.abs(a.y - b.y) < HEIGHT) {
		return true
	}

	return false
}

function hit_test_point(node, w, px, py) {
	if (Math.abs(node.x - px) < w / 2 &&
		Math.abs(node.y - py) < HEIGHT / 2) {
		return true
	}

	return false
}
