const calamitylaserii = extend(BasicBulletType, {
	
	update: function(b){
		Effects.shake(1.2, 1.2, b.x, b.y);
		if(b.timer.get(1, 5)){
			Damage.collideLine(b, b.team, this.hitEffect, b.x, b.y, b.vel.angle(), 390.0, true);
		};
		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.3)){
			Tmp.v2.trns(b.vel.angle() + 90.0, Mathf.range(7.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 10, b.x + Tmp.v2.x, b.y + Tmp.v2.y, b.vel.angle(), Mathf.random(47, 52));
		};
		if(Mathf.chance(Math.min(Core.graphics.getDeltaTime() * 60, 3) * 0.2)){
			Tmp.v2.trns(b.vel.angle(), Mathf.random(0.5, 390.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 16, b.x + Tmp.v2.x, b.y + Tmp.v2.y, Mathf.random(360), 12);
		};
		if(Mathf.chance(0.9)){
			//Tmp.v3.trns(b.vel.angle(), Mathf.random(0.2, 390.0));
			Tmp.v2.trns(b.vel.angle(), Mathf.random(0.2, 390.0), Mathf.range(15.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 12, b.x + Tmp.v2.x, b.y + Tmp.v2.y, b.vel.angle(), Mathf.random(5, 16));
		};
		if(Mathf.chance(0.93)){
			//Tmp.v3.trns(b.vel.angle(), Mathf.random(0.2, 390.0));
			Tmp.v2.trns(b.vel.angle(), Mathf.random(0.2, 390.0), Mathf.range(10.0));
			Lightning.create(b.team, Color.valueOf("ff9c5a"), 10, b.x + Tmp.v2.x, b.y + Tmp.v2.y, b.vel.angle(), Mathf.random(8, 18));
		};
		if(Mathf.chance(0.9)){
			Tmp.v2.trns(b.vel.angle(), Mathf.random(2.9, 390.0));
			Damage.createIncend(b.x + Tmp.v2.x, b.y + Tmp.v2.y, 7, 2);
		}
	},
	
	hit: function(b, hitx, hity){
		if(hitx != null && hity != null){
			Effects.effect(this.hitEffect, Color.valueOf("ec7458aa"), hitx, hity);
			if(Mathf.chance(0.15)){
				Damage.createIncend(hitx, hity, 7, 1);
			}
		}
	},
	
	draw: function(b){
		
		const colors = [Color.valueOf("ec745855"), Color.valueOf("ec7458aa"), Color.valueOf("ff9c5a"), Color.valueOf("ffffff")];
		const tscales = [1, 0.74, 0.5, 0.24];
		const strokes = [2.9, 2.2, 1.6, 0.8];
		const lenscales = [1.0, 1.12, 1.15, 1.164];
		const tmpColor = new Color();

		for(var s = 0; s < 4; s++){
			Draw.color(tmpColor.set(colors[s]).mul(1.0 + Mathf.absin(Time.time, 1.2, 0.4)));
			for(var i = 0; i < 4; i++){
				Tmp.v1.trns(b.vel.angle() + 180.0, (lenscales[i] - 0.9) * 55.0);
				Lines.stroke((9 + Mathf.absin(Time.time, 1.7, 3.1)) * b.fout() * strokes[s] * tscales[i]);
				Lines.lineAngle(b.x + Tmp.v1.x, b.y + Tmp.v1.y, b.vel.angle(), 370.0 * b.fout() * lenscales[i], false);
			}
		};
		Draw.reset();
	}
});

calamitylaserii.speed = 0.001;
calamitylaserii.damage = 140;
calamitylaserii.lifetime = 18;
calamitylaserii.hitEffect = Fx.hitMeltdown;
calamitylaserii.despawnEffect = Fx.none;
calamitylaserii.hitSize = 7;
calamitylaserii.drawSize = 720;
calamitylaserii.pierce = true;
calamitylaserii.shootEffect = Fx.none;
calamitylaserii.smokeEffect = Fx.none;

const tmpCol = new Color();

const pow6In = new Interp.PowIn(6);

const calamityii = extendContent(LaserTurret, "ac-calamity-ii",{
	load(){
		this.super$load();
		
		this.region = Core.atlas.find(this.name);
		this.baseRegion = Core.atlas.find("advancecontent-block-8");
		this.heatRegion = Core.atlas.find(this.name + "-heat");
	},
	
	generateIcons: function(){
	return [
		Core.atlas.find("advancecontent-block-8"),
		Core.atlas.find("advancecontent-ac-calamity-ii")
	];},
	
	draw: function(tile){
		Draw.rect(this.baseRegion, tile.drawx(), tile.drawy());
	},
	
	drawLayer: function(tile){
		//const tr2 = new Vec2();
		
		entity = tile.ent();

		this.tr2.trns(entity.rotation, -entity.recoil);

		Draw.rect(this.region, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
		
		if(entity.heat > 0.0001){
			//Draw.color(1.0, 1.0 * Mathf.lerpDelta(entity.heat, 0.5, 0.15), 1.0 * Mathf.lerpDelta(entity.heat, 0.0, 0.6), entity.heat);
			var r = Interp.pow2Out.apply(entity.heat);
			var g = Interp.pow3In.apply(entity.heat) + ((1 - Interp.pow3In.apply(entity.heat)) * 0.12);
			var b = pow6In.apply(entity.heat);
			var a = Interp.pow2Out.apply(entity.heat);
			tmpCol.set(r, g, b, a);
			Draw.color(tmpCol);
			Draw.blend(Blending.additive);
			Draw.rect(this.heatRegion, tile.drawx() + this.tr2.x, tile.drawy() + this.tr2.y, entity.rotation - 90);
			Draw.blend();
			Draw.color();
		}
	}
});
calamityii.shootType = calamitylaserii;
calamityii.update = true;