(function() {
    var data = window.kityminder.data

	data.registerProtocol('csv', {
		fileDescription: 'KityMinder',
		fileExtension: '.csv',
		dataType: 'text',
		mineType: 'text/csv',
		encode: function(json) {
			const SEPARATOR=','
			const HEADER ="PATH,TITLE,NOTE"
			const QUOTE='"'
			const NEWLINE='\n'
			const universalBOM = "\uFEFF";

			var rootData = json.root

			/* Recursive function to dig into JSON tree */
			var recFlattenJSON = function (json,path){
				if(json.data.text === undefined){
					throw "Error in .KM Structure: missing Title!"
				}
				var title = json.data.text.replace(/"/g, '\"')

				var note = ""
				if (json.data.note !== undefined && json.data.note != "") {
				 note = QUOTE + json.data.note.replace(/"/g, '\"') +QUOTE
				}
				result = QUOTE + path + QUOTE + SEPARATOR + QUOTE + title + QUOTE + SEPARATOR + note + NEWLINE

				if(json.children !== undefined && json.children.length > 0){
					json.children.forEach(function (child){
						result += recFlattenJSON(child, path + '//' + title)
					})
				}
				return result
			}
			var output = recFlattenJSON(rootData, "")
			return universalBOM + HEADER + NEWLINE + output
		},
	})
})();