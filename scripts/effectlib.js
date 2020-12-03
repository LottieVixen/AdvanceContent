module.exports = {
	newEffectWDraw(lifetime, drawDst, renderer){
		return new Effect.Effect(lifetime, drawDst, new Effect.EffectRenderer({render: renderer}));
	},
	
	newGroundEffect(lifetime, staticLife, renderer){
		return new GroundEffectEntity.GroundEffect(lifetime, staticLife, new Effect.EffectRenderer({render: renderer}));
	}
}