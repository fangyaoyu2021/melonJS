import { describe, expect, it } from "vitest";
import { ObservableVector3d } from "../src/index.js";
import { Vector3d, Vector2d } from "../src/index.js";
import { math } from "../src/index.js";

describe("ObservableVector3d : constructor", () => {
	const x = 1;
	const y = 2;
	const z = 3;

	let a: ObservableVector3d;
	let b: ObservableVector3d;
	let c: ObservableVector3d;
	let d: ObservableVector3d;

	it("creates a new ObservableVector3d instance with default values", () => {
		a = new ObservableVector3d();
		b = new ObservableVector3d();
		c = new ObservableVector3d();
		d = new ObservableVector3d();

		expect(a.toString()).toEqual("x:0,y:0,z:0");
	});

	it("creates a new ObservablePoint instance with specified values", () => {
		const observableVector = new ObservableVector3d(10, 20, 3);
		expect(observableVector.x).toEqual(10);
		expect(observableVector.y).toEqual(20);
		expect(observableVector.z).toEqual(3);
	});

	it("values can be compared with a Point object", () => {
		const observableVector = new ObservableVector3d(10, 20, 3);
		const vector3 = new Vector3d(10, 20, 3);
		expect(observableVector.equals(vector3)).toEqual(true);
	});

	it("triggers the callback function when setting values", () => {
		let callbackCalled = false;
		const callback = () => {
			callbackCalled = true;
		};
		const observableVector = new ObservableVector3d(0, 0, 0, callback);
		expect(observableVector.x).toEqual(0);
		expect(observableVector.y).toEqual(0);
		expect(callbackCalled).toEqual(false);

		observableVector.x = 10;
		expect(observableVector.x).toEqual(10);
		expect(callbackCalled).toEqual(true);
	});

	it("triggers the callback function when calling set()", () => {
		let callbackCalled = false;
		const callback = () => {
			callbackCalled = true;
		};
		const observableVector = new ObservableVector3d(1, 2, 3, callback);
		expect(observableVector.x).toEqual(1);
		expect(observableVector.y).toEqual(2);
		expect(observableVector.z).toEqual(3);
		expect(callbackCalled).toEqual(false);

		observableVector.set(10, 20);
		expect(observableVector.equals(10, 20)).toEqual(true);
		expect(callbackCalled).toEqual(true);
	});

	it("does not trigger the callback function when using setMuted", () => {
		let callbackCalled = false;
		const callback = () => {
			callbackCalled = true;
		};
		const observableVector = new ObservableVector3d(1, 2, 3, callback);
		expect(observableVector.x).toEqual(1);
		expect(observableVector.y).toEqual(2);
		expect(observableVector.z).toEqual(3);
		expect(callbackCalled).toEqual(false);

		observableVector.setMuted(10, 20, 0);
		expect(observableVector.equals(10, 20, 0)).toEqual(true);
		expect(callbackCalled).toEqual(false);
	});

	it("does not trigger the callback function when revoked", () => {
		let callbackCalled = false;
		const callback = () => {
			callbackCalled = true;
		};
		const observableVector = new ObservableVector3d(1, 2, 3, callback);
		expect(observableVector.x).toEqual(1);
		expect(observableVector.y).toEqual(2);
		expect(observableVector.z).toEqual(3);
		expect(callbackCalled).toEqual(false);

		observableVector.revoke();
		expect(() => {
			observableVector.set(20, 10);
		}).toThrow();
	});

	it("a(1, 2, 3) should be copied into b", () => {
		a.set(x, y, z);
		b.copy(a);

		expect(b.equals(a)).toEqual(true);
		// this should be true too
		expect(b.equals(a.x, a.y, a.z)).toEqual(true);
		// and also this one
		expect(b.equals(a.x, a.y)).toEqual(true);
	});

	it("set (1, 2, 3) into a defined vector", () => {
		a.set(x, y, z);

		expect(a.toString()).toEqual(`x:${x},y:${y},z:${z}`);
	});

	it("use a 2d vector to set this vector", () => {
		const vec2 = new Vector2d(x, y);
		a.setV(vec2);
		expect(a.toString()).toEqual(`x:${x},y:${y},z:0`);

		a.set(y, x);
		expect(a.toString()).toEqual(`x:${y},y:${x},z:0`);
	});

	it("add (1, 2, 3) to (-1, -2, -3)", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);

		expect(a.add(b).toString()).toEqual("x:0,y:0,z:0");
	});

	it("sub (1, 2, 3) to (-1, -2, -3)", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);

		expect(a.sub(b).toString()).toEqual(`x:${x - -x},y:${y - -y},z:${z - -z}`);
	});

	it("scale (1, 2, 3) by (-1, -2, -3)", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);

		expect(a.scaleV(b).toString()).toEqual(
			`x:${x * -x},y:${y * -y},z:${z * -z}`,
		);

		a.set(x, y, z);

		expect(a.scale(-1, -1, -1).equals(b)).toEqual(true);
	});

	it("negate (1, 2, 3)", () => {
		a.set(x, y, z);

		expect(a.negateSelf().toString()).toEqual(`x:${-x},y:${-y},z:${-z}`);
	});

	it("dot Product (1, 2, 3) and (-1, -2, -3)", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);

		// calculate the dot product
		expect(a.dot(b)).toEqual(-x * x - y * y - z * z);
	});

	it("cross Product(2, 3, 4) and (5, 6, 7)", () => {
		a.set(2, 3, 4);
		b.set(5, 6, 7);

		const crossed = new Vector3d(-3, 6, -3);

		// calculate the cross product
		a.cross(b);
		expect(Math.abs(a.x - crossed.x)).toBeCloseTo(0, 4);
		expect(Math.abs(a.y - crossed.y)).toBeCloseTo(0, 4);
		expect(Math.abs(a.z - crossed.z)).toBeCloseTo(0, 4);
	});

	it("length/lengthSqrt functions", () => {
		a.set(x, 0, 0);
		b.set(0, -y, 0);
		c.set(0, 0, z);
		d.set(0, 0, 0);

		expect(a.length()).toEqual(x);
		expect(a.length2()).toEqual(x * x);
		expect(b.length()).toEqual(y);
		expect(b.length2()).toEqual(y * y);
		expect(c.length()).toEqual(z);
		expect(c.length2()).toEqual(z * z);
		expect(d.length()).toEqual(0);
		expect(d.length2()).toEqual(0);

		a.set(x, y, z);

		expect(a.length()).toEqual(Math.sqrt(x * x + y * y + z * z));
		expect(a.length2()).toEqual(x * x + y * y + z * z);
	});

	it("lerp functions", () => {
		const l = new ObservableVector3d();
		a.set(x, 0, z);
		b.set(0, -y, 0);

		expect(l.copy(a).lerp(a, 0).equals(a.lerp(a, 0.5))).toEqual(true);
		expect(l.copy(a).lerp(a, 0).equals(a.lerp(a, 1))).toEqual(true);

		expect(l.copy(a).lerp(b, 0).equals(a)).toEqual(true);

		expect(l.copy(a).lerp(b, 0.5).x).toEqual(x * 0.5);
		expect(l.copy(a).lerp(b, 0.5).y).toEqual(-y * 0.5);
		expect(l.copy(a).lerp(b, 0.5).z).toEqual(z * 0.5);

		expect(l.copy(a).lerp(b, 1).equals(b)).toEqual(true);
	});

	it("normalize function", () => {
		a.set(x, 0, 0);
		b.set(0, -y, 0);
		c.set(0, 0, z);

		a.normalize();
		expect(a.length()).toEqual(1);
		expect(a.x).toEqual(1);

		b.normalize();
		expect(b.length()).toEqual(1);
		expect(b.y).toEqual(-1);

		c.normalize();
		expect(c.length()).toEqual(1);
		expect(c.z).toEqual(1);
	});

	it("distance function", () => {
		a.set(x, 0, 0);
		b.set(0, -y, 0);
		c.set(0, 0, z);
		d.set(0, 0, 0);

		expect(a.distance(d)).toEqual(x);
		expect(b.distance(d)).toEqual(y);
		expect(c.distance(d)).toEqual(z);
	});

	it("min/max/clamp", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);
		c.set(0, 0, 0);

		c.copy(a).minV(b);
		expect(c.x).toEqual(-x);
		expect(c.y).toEqual(-y);
		expect(c.z).toEqual(-z);

		c.copy(a).maxV(b);
		expect(c.x).toEqual(x);
		expect(c.y).toEqual(y);
		expect(c.z).toEqual(z);

		c.set(-2 * x, 2 * x, 2 * z);
		c.clampSelf(-x, x);
		expect(c.x).toEqual(-x);
		expect(c.y).toEqual(x);
		expect(c.z).toEqual(x);
	});

	it("ceil/floor", () => {
		expect(
			a
				.set(-0.1, 0.1, 0.3)
				.floorSelf()
				.equals(new Vector3d(-1, 0, 0)),
		).toEqual(true);
		expect(
			a
				.set(-0.5, 0.5, 0.6)
				.floorSelf()
				.equals(new Vector3d(-1, 0, 0)),
		).toEqual(true);
		expect(
			a
				.set(-0.9, 0.9, 0.8)
				.floorSelf()
				.equals(new Vector3d(-1, 0, 0)),
		).toEqual(true);

		expect(
			a
				.set(-0.1, 0.1, 0.3)
				.ceilSelf()
				.equals(new Vector3d(0, 1, 1)),
		).toEqual(true);
		expect(
			a
				.set(-0.5, 0.5, 0.6)
				.ceilSelf()
				.equals(new Vector3d(0, 1, 1)),
		).toEqual(true);
		expect(
			a
				.set(-0.9, 0.9, 0.9)
				.ceilSelf()
				.equals(new Vector3d(0, 1, 1)),
		).toEqual(true);
	});

	it("project a on b", () => {
		a.set(x, y, z);
		b.set(-x, -y, -z);

		// the following only works with (-)1, (-)2, (-)3 style of values
		expect(a.project(b).equals(b)).toEqual(true);
	});

	it("angle between a and b", () => {
		a.set(0, -0.18851655680720186, 0.9820700116639124);
		b.set(0, 0.18851655680720186, -0.9820700116639124);

		expect(a.angle(a)).toEqual(0);
		expect(a.angle(b)).toEqual(Math.PI);

		a.set(x, y, 0);
		b.set(-x, -y, 0);

		// why is this not perfectly 180 degrees ?
		expect(math.round(math.radToDeg(a.angle(b)))).toEqual(180);

		b.set(4 * x, -y, 0);
		expect(a.angle(b)).toEqual(Math.PI / 2);
	});

	it("rotate around its origin point", () => {
		a.set(1, 0, 1);
		// rotate the vector by 90 degree clockwise
		a.rotate(Math.PI / 2);

		expect(a.x).toBeCloseTo(0, 5);
		expect(a.y).toBeCloseTo(1, 5);
	});

	it("rotate around a given 2d point", () => {
		a.set(1, 0, 1);
		// rotate the vector by 90 degree clockwise on the z axis
		a.rotate(Math.PI / 2, new Vector2d(1, 1));

		expect(a.x).toBeCloseTo(2, 5);
		expect(a.y).toBeCloseTo(1, 5);
	});

	it("perp and rotate function", () => {
		a.set(x, y, z);
		b.copy(a).perp();
		// perp rotate the vector by 90 degree clockwise on the z axis
		c.copy(a).rotate(Math.PI / 2);

		expect(a.angle(b)).toEqual(a.angle(c));
	});

	it("convert vector to iso coordinates", () => {
		a.set(32, 32, 1);

		a.toIso();
		expect(a.toString()).toEqual("x:0,y:32,z:1");

		a.to2d();
		expect(a.toString()).toEqual("x:32,y:32,z:1");
	});

	it("angle function", () => {
		a.set(6, 3, 1);
		b.set(5, 13, 1);
		expect(math.radToDeg(a.angle(b))).toBeCloseTo(42, -1);

		a.set(3, -6, 1);
		b.set(8, 4, 1);
		expect(math.radToDeg(a.angle(b))).toBeCloseTo(90, -1);
	});

	describe("equals", () => {
		it("should return true when comparing with the same vector", () => {
			const vector = new Vector3d(1, 2, 3);
			expect(vector.equals(vector)).toEqual(true);
		});

		it("should return true when comparing with a vector with the same values", () => {
			const vector1 = new Vector3d(1, 2, 3);
			const vector2 = new Vector3d(1, 2, 3);
			expect(vector1.equals(vector2)).toEqual(true);
		});

		it("should return true when comparing with a 2d vector with the same values for x and y", () => {
			const vector1 = new Vector3d(1, 2, 3);
			const vector2 = new Vector2d(1, 2);
			expect(vector1.equals(vector2)).toEqual(true);
		});

		it("should return true when comparing with vector components", () => {
			const vector = new Vector3d(1, 2, 3);
			expect(vector.equals(1, 2, 3)).toEqual(true);
		});

		it("should return false when comparing with a vector with different values", () => {
			const vector1 = new Vector3d(1, 2, 3);
			const vector2 = new Vector3d(4, 5, 6);
			expect(vector1.equals(vector2)).toEqual(false);
		});

		it("should return false when comparing with different vector components", () => {
			const vector = new Vector3d(1, 2, 3);
			expect(vector.equals(4, 5, 6)).toEqual(false);
		});
	});
});
