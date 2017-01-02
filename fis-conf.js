fis
.match('*.less',{
	parser:fis.plugin('less'),
	rExt:'.css'
})
.match('*.less',{
	postprocessor:fis.plugin('less-autoprefix',{browsers:["last 4 versions"]})
});

fis.media('prod')
.match('*.js',{
	optimizer:fis.plugin('uglify-js')
})
.match('**.{js,less,jpg,png,git}',{
	useHash:true,
	url:'/public/gesturePassword$0'
})
.match('*.html',{
	optimizer:fis.plugin('html-minifier')
})



