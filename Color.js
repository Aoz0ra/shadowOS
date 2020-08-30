if(typeof module !== "undefined") {
	module.exports = Color;
} else {
	this.Color = Color;
}

function Color() {
	var r,g,b;
	if(arguments.length === 1) {
		var hexa = arguments[0].toLowerCase();
		if(hexa.match(/^#[0-9a-f]{6}$/i)) {
			hexa = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(hexa);
			if(hexa && hexa.length === 4) {
				r = parseInt(hexa[1], 16);
				g = parseInt(hexa[2], 16);
				b = parseInt(hexa[3], 16);
			}
		}
	} else if(arguments.length === 3) {
		r = arguments[0];
		g = arguments[1];
		b = arguments[2];
	}
	this.r = ~~r || 0;
	this.g = ~~g || 0;
	this.b = ~~b || 0;
};

Color.prototype.distance = function(color) {
	var d = 0;
	d += Math.pow(this.r - color.r, 2);
	d += Math.pow(this.g - color.g, 2);
	d += Math.pow(this.b - color.b, 2);
	return Math.abs(Math.sqrt(d));
};

Color.prototype.add = function(r, g, b) {
	this.r += r;
	this.g += g;
	this.b += b;
	if(this.r < 0) this.r = 0;
	else if(this.r > 255) this.r = 255;
	if(this.g < 0) this.g = 0;
	else if(this.g > 255) this.g = 255;
	if(this.b < 0) this.b = 0;
	else if(this.b > 255) this.b = 255;
};

Color.prototype.toHexa = function() {
	var r = (~~this.r || 0).toString(16), g = (~~this.g || 0).toString(16), b = (~~this.b || 0).toString(16);
	if(r.length == 1) r = "0" + r;
	if(g.length == 1) g = "0" + g;
	if(b.length == 1) b = "0" + b;
	return "#"+r+g+b;
}

Color.prototype.getName = function() {
	var hexa = this.toHexa();
	var low = 256;
	var name;
	for(var n in Color.map) {
		if(!Color.map.hasOwnProperty(n))
			continue;
		var color = Color.map[n];
		if(color.r === this.r && color.g === this.g && color.b === this.b) {
			return n;
		}
		var dist = this.distance(color);
		if(dist < low) {
			low = dist;
			name = n;
		}
	}
	if(!name)
		name = this.toHexa();
	else
		name = "A shade of " + name;
	return name;
};

Color.map = {};

Color.addToMap = function(hexa, name) {
	Color.map[name] = new Color(hexa);
};

Color.addToMap("#7CB9E8", "Aero");
Color.addToMap("#C9FFE5", "Aero blue");
Color.addToMap("#B284BE", "African purple");
Color.addToMap("#5D8AA8", "Air Force blue (RAF)");
Color.addToMap("#00308F", "Air Force blue (USAF)");
Color.addToMap("#72A0C1", "Air superiority blue");
Color.addToMap("#AF002A", "Alabama Crimson");
Color.addToMap("#F0F8FF", "Alice blue");
Color.addToMap("#E32636", "Alizarin crimson");
Color.addToMap("#C46210", "Alloy orange");
Color.addToMap("#EFDECD", "Almond");
Color.addToMap("#E52B50", "Amaranth");
Color.addToMap("#F19CBB", "Amaranth pink");
Color.addToMap("#AB274F", "Dark amaranth");
Color.addToMap("#3B7A57", "Amazon");
Color.addToMap("#FF7E00", "Amber");
Color.addToMap("#FF033E", "American rose");
Color.addToMap("#9966CC", "Amethyst");
Color.addToMap("#A4C639", "Android green");
Color.addToMap("#F2F3F4", "Anti-flash white");
Color.addToMap("#CD9575", "Antique brass");
Color.addToMap("#665D1E", "Antique bronze");
Color.addToMap("#915C83", "Antique fuchsia");
Color.addToMap("#841B2D", "Antique ruby");
Color.addToMap("#FAEBD7", "Antique white");
Color.addToMap("#8DB600", "Apple green");
Color.addToMap("#FBCEB1", "Apricot");
Color.addToMap("#00FFFF", "Aqua");
Color.addToMap("#7FFFD4", "Aquamarine");
Color.addToMap("#4B5320", "Army green");
Color.addToMap("#3B444B", "Arsenic");
Color.addToMap("#8F9779", "Artichoke");
Color.addToMap("#B2BEB5", "Ash grey");
Color.addToMap("#87A96B", "Asparagus");
Color.addToMap("#FDEE00", "Aureolin");
Color.addToMap("#6E7F80", "AuroMetalSaurus");
Color.addToMap("#568203", "Avocado");
Color.addToMap("#007FFF", "Azure");
Color.addToMap("#F0FFFF", "Azure mist/web");
Color.addToMap("#89CFF0", "Baby blue");
Color.addToMap("#A1CAF1", "Baby blue eyes");
Color.addToMap("#FEFEFA", "Baby powder");
Color.addToMap("#FF91AF", "Baker-Miller pink");
Color.addToMap("#21ABCD", "Ball blue");
Color.addToMap("#FAE7B5", "Banana Mania");
Color.addToMap("#FFE135", "Banana yellow");
Color.addToMap("#E0218A", "Barbie pink");
Color.addToMap("#7C0A02", "Barn red");
Color.addToMap("#848482", "Battleship grey");
Color.addToMap("#98777B", "Bazaar");
Color.addToMap("#9F8170", "Beaver");
Color.addToMap("#F5F5DC", "Beige");
Color.addToMap("#2E5894", "B'dazzled blue");
Color.addToMap("#9C2542", "Big dip o’ruby");
Color.addToMap("#FFE4C4", "Bisque");
Color.addToMap("#3D2B1F", "Bistre");
Color.addToMap("#967117", "Bistre brown");
Color.addToMap("#CAE00D", "Bitter lemon");
Color.addToMap("#648C11", "Bitter lime");
Color.addToMap("#FE6F5E", "Bittersweet");
Color.addToMap("#BF4F51", "Bittersweet shimmer");
Color.addToMap("#000000", "Black");
Color.addToMap("#3D0C02", "Black bean");
Color.addToMap("#253529", "Black leather jacket");
Color.addToMap("#3B3C36", "Black olive");
Color.addToMap("#FFEBCD", "Blanched almond");
Color.addToMap("#A57164", "Blast-off bronze");
Color.addToMap("#318CE7", "Bleu de France");
Color.addToMap("#ACE5EE", "Blizzard Blue");
Color.addToMap("#FAF0BE", "Blond");
Color.addToMap("#0000FF", "Blue");
Color.addToMap("#1F75FE", "Blue (Crayola)");
Color.addToMap("#0093AF", "Blue (Munsell)");
Color.addToMap("#0087BD", "Blue (NCS)");
Color.addToMap("#333399", "Blue (pigment)");
Color.addToMap("#0247FE", "Blue (RYB)");
Color.addToMap("#A2A2D0", "Blue Bell");
Color.addToMap("#6699CC", "Blue-gray");
Color.addToMap("#0D98BA", "Blue-green");
Color.addToMap("#126180", "Blue sapphire");
Color.addToMap("#8A2BE2", "Blue-violet");
Color.addToMap("#5072A7", "Blue yonder");
Color.addToMap("#4F86F7", "Blueberry");
Color.addToMap("#1C1CF0", "Bluebonnet");
Color.addToMap("#DE5D83", "Blush");
Color.addToMap("#79443B", "Bole Brown");
Color.addToMap("#0095B6", "Bondi blue");
Color.addToMap("#E3DAC9", "Bone");
Color.addToMap("#CC0000", "Boston University Red");
Color.addToMap("#006A4E", "Bottle green");
Color.addToMap("#873260", "Boysenberry");
Color.addToMap("#0070FF", "Brandeis blue");
Color.addToMap("#B5A642", "Brass");
Color.addToMap("#CB4154", "Brick red");
Color.addToMap("#1DACD6", "Bright cerulean");
Color.addToMap("#66FF00", "Bright green");
Color.addToMap("#BF94E4", "Bright lavender");
Color.addToMap("#D891EF", "Bright lilac");
Color.addToMap("#C32148", "Bright maroon");
Color.addToMap("#1974D2", "Bright navy blue");
Color.addToMap("#FF007F", "Bright pink");
Color.addToMap("#08E8DE", "Bright turquoise");
Color.addToMap("#D19FE8", "Bright ube");
Color.addToMap("#F4BBFF", "Brilliant lavender");
Color.addToMap("#FF55A3", "Brilliant rose");
Color.addToMap("#FB607F", "Brink pink");
Color.addToMap("#004225", "British racing green");
Color.addToMap("#CD7F32", "Bronze");
Color.addToMap("#737000", "Bronze Yellow");
Color.addToMap("#964B00", "Brown");
Color.addToMap("#6B4423", "Brown-nose");
Color.addToMap("#FFC1CC", "Bubble gum");
Color.addToMap("#E7FEFF", "Bubbles");
Color.addToMap("#F0DC82", "Buff");
Color.addToMap("#7BB661", "Bud green");
Color.addToMap("#480607", "Bulgarian rose");
Color.addToMap("#800020", "Burgundy");
Color.addToMap("#DEB887", "Burlywood");
Color.addToMap("#CC5500", "Burnt orange");
Color.addToMap("#8A3324", "Burnt umber");
Color.addToMap("#BD33A4", "Byzantine");
Color.addToMap("#702963", "Byzantium");
Color.addToMap("#536872", "Cadet");
Color.addToMap("#5F9EA0", "Cadet blue");
Color.addToMap("#91A3B0", "Cadet grey");
Color.addToMap("#006B3C", "Cadmium green");
Color.addToMap("#ED872D", "Cadmium orange");
Color.addToMap("#E30022", "Cadmium red");
Color.addToMap("#FFF600", "Cadmium yellow");
Color.addToMap("#A67B5B", "Cafe au lait");
Color.addToMap("#4B3621", "Cafe noir");
Color.addToMap("#1E4D2B", "Cal Poly green");
Color.addToMap("#A3C1AD", "Cambridge Blue");
Color.addToMap("#EFBBCC", "Cameo pink");
Color.addToMap("#78866B", "Camouflage green");
Color.addToMap("#FFEF00", "Canary yellow");
Color.addToMap("#FF0800", "Candy apple red");
Color.addToMap("#E4717A", "Candy pink");
Color.addToMap("#592720", "Caput mortuum");
Color.addToMap("#C41E3A", "Cardinal");
Color.addToMap("#00CC99", "Caribbean green");
Color.addToMap("#960018", "Carmine");
Color.addToMap("#EB4C42", "Carmine pink");
Color.addToMap("#FF0038", "Carmine red");
Color.addToMap("#FFA6C9", "Carnation pink");
Color.addToMap("#99BADD", "Carolina blue");
Color.addToMap("#ED9121", "Carrot orange");
Color.addToMap("#00563F", "Castleton green");
Color.addToMap("#062A78", "Catalina blue");
Color.addToMap("#703642", "Catawba");
Color.addToMap("#C95A49", "Cedar Chest");
Color.addToMap("#92A1CF", "Ceil");
Color.addToMap("#ACE1AF", "Celadon");
Color.addToMap("#007BA7", "Celadon blue");
Color.addToMap("#2F847C", "Celadon green");
Color.addToMap("#4997D0", "Celestial blue");
Color.addToMap("#EC3B83", "Cerise pink");
Color.addToMap("#2A52BE", "Cerulean blue");
Color.addToMap("#6D9BC3", "Cerulean frost");
Color.addToMap("#007AA5", "CG Blue");
Color.addToMap("#E03C31", "CG Red");
Color.addToMap("#A0785A", "Chamoisee");
Color.addToMap("#F7E7CE", "Champagne");
Color.addToMap("#36454F", "Charcoal");
Color.addToMap("#232B2B", "Charleston green");
Color.addToMap("#E68FAC", "Charm pink");
Color.addToMap("#DFFF00", "Chartreuse");
Color.addToMap("#7FFF00", "Chartreuse (web)");
Color.addToMap("#DE3163", "Cherry");
Color.addToMap("#FFB7C5", "Cherry blossom pink");
Color.addToMap("#954535", "Chestnut");
Color.addToMap("#A8516E", "China rose");
Color.addToMap("#AA381E", "Chinese red");
Color.addToMap("#856088", "Chinese violet");
Color.addToMap("#7B3F00", "Chocolate");
Color.addToMap("#FFA700", "Chrome yellow");
Color.addToMap("#98817B", "Cinereous");
Color.addToMap("#E4D00A", "Citrine");
Color.addToMap("#9FA91F", "Citron");
Color.addToMap("#7F1734", "Claret");
Color.addToMap("#FBCCE7", "Classic rose");
Color.addToMap("#0047AB", "Cobalt");
Color.addToMap("#D2691E", "Cocoa brown");
Color.addToMap("#965A3E", "Coconut");
Color.addToMap("#6F4E37", "Coffee Brown");
Color.addToMap("#9BDDFF", "Columbia blue");
Color.addToMap("#002E63", "Cool black");
Color.addToMap("#8C92AC", "Cool grey");
Color.addToMap("#B87333", "Copper");
Color.addToMap("#AD6F69", "Copper penny");
Color.addToMap("#CB6D51", "Copper red");
Color.addToMap("#996666", "Copper rose");
Color.addToMap("#FF3800", "Coquelicot");
Color.addToMap("#FF7F50", "Coral");
Color.addToMap("#F88379", "Coral pink");
Color.addToMap("#FF4040", "Coral red");
Color.addToMap("#893F45", "Cordovan");
Color.addToMap("#FBEC5D", "Corn Yellow");
Color.addToMap("#B31B1B", "Cornell Red");
Color.addToMap("#6495ED", "Cornflower blue");
Color.addToMap("#FFF8DC", "Cornsilk");
Color.addToMap("#FFF8E7", "Cosmic latte");
Color.addToMap("#FFBCD9", "Cotton candy");
Color.addToMap("#FFFDD0", "Cream");
Color.addToMap("#DC143C", "Crimson");
Color.addToMap("#BE0032", "Crimson glory");
Color.addToMap("#00B7EB", "Cyan");
Color.addToMap("#58427C", "Cyber grape");
Color.addToMap("#FFD300", "Cyber yellow");
Color.addToMap("#FFFF31", "Daffodil");
Color.addToMap("#F0E130", "Dandelion");
Color.addToMap("#00008B", "Dark blue");
Color.addToMap("#666699", "Dark blue-gray");
Color.addToMap("#654321", "Dark brown");
Color.addToMap("#5D3954", "Dark byzantium");
Color.addToMap("#A40000", "Dark candy apple red");
Color.addToMap("#08457E", "Dark cerulean");
Color.addToMap("#986960", "Dark chestnut");
Color.addToMap("#CD5B45", "Dark coral");
Color.addToMap("#008B8B", "Dark cyan");
Color.addToMap("#536878", "Dark electric blue");
Color.addToMap("#B8860B", "Dark goldenrod");
Color.addToMap("#A9A9A9", "Dark gray");
Color.addToMap("#013220", "Dark green");
Color.addToMap("#00416A", "Dark imperial blue");
Color.addToMap("#1A2421", "Dark jungle green");
Color.addToMap("#BDB76B", "Dark khaki");
Color.addToMap("#734F96", "Dark lavender");
Color.addToMap("#534B4F", "Dark liver");
Color.addToMap("#543D37", "Dark liver (horses)");
Color.addToMap("#8B008B", "Dark magenta");
Color.addToMap("#003366", "Dark midnight blue");
Color.addToMap("#4A5D23", "Dark moss green");
Color.addToMap("#556B2F", "Dark olive green");
Color.addToMap("#FF8C00", "Dark orange");
Color.addToMap("#9932CC", "Dark orchid");
Color.addToMap("#779ECB", "Dark pastel blue");
Color.addToMap("#03C03C", "Dark pastel green");
Color.addToMap("#966FD6", "Dark pastel purple");
Color.addToMap("#C23B22", "Dark pastel red");
Color.addToMap("#E75480", "Dark pink");
Color.addToMap("#003399", "Dark powder blue");
Color.addToMap("#4F3A3C", "Dark puce");
Color.addToMap("#872657", "Dark raspberry");
Color.addToMap("#8B0000", "Dark red");
Color.addToMap("#E9967A", "Dark salmon");
Color.addToMap("#560319", "Dark scarlet");
Color.addToMap("#8FBC8F", "Dark sea green");
Color.addToMap("#3C1414", "Dark sienna");
Color.addToMap("#8CBED6", "Dark sky blue");
Color.addToMap("#483D8B", "Dark slate blue");
Color.addToMap("#2F4F4F", "Dark slate gray");
Color.addToMap("#177245", "Dark spring green");
Color.addToMap("#918151", "Dark tan");
Color.addToMap("#FFA812", "Dark tangerine");
Color.addToMap("#CC4E5C", "Dark terra cotta");
Color.addToMap("#00CED1", "Dark turquoise");
Color.addToMap("#D1BEA8", "Dark vanilla");
Color.addToMap("#9400D3", "Dark violet");
Color.addToMap("#9B870C", "Dark yellow");
Color.addToMap("#00703C", "Dartmouth green");
Color.addToMap("#555555", "Davy's grey");
Color.addToMap("#D70A53", "Debian red");
Color.addToMap("#A9203E", "Deep carmine");
Color.addToMap("#EF3038", "Deep carmine pink");
Color.addToMap("#E9692C", "Deep carrot orange");
Color.addToMap("#DA3287", "Deep cerise");
Color.addToMap("#B94E48", "Deep chestnut");
Color.addToMap("#C154C1", "Deep fuchsia");
Color.addToMap("#004B49", "Deep jungle green");
Color.addToMap("#F5C71A", "Deep lemon");
Color.addToMap("#9955BB", "Deep lilac");
Color.addToMap("#CC00CC", "Deep magenta");
Color.addToMap("#D473D4", "Deep mauve");
Color.addToMap("#355E3B", "Deep moss green");
Color.addToMap("#FFCBA4", "Deep peach");
Color.addToMap("#A95C68", "Deep puce");
Color.addToMap("#843F5B", "Deep ruby");
Color.addToMap("#FF9933", "Deep saffron");
Color.addToMap("#00BFFF", "Deep sky blue");
Color.addToMap("#4A646C", "Deep Space Sparkle");
Color.addToMap("#7E5E60", "Deep Taupe");
Color.addToMap("#66424D", "Deep Tuscan red");
Color.addToMap("#BA8759", "Deer");
Color.addToMap("#1560BD", "Denim");
Color.addToMap("#EDC9AF", "Desert sand");
Color.addToMap("#EA3C53", "Desire");
Color.addToMap("#B9F2FF", "Diamond");
Color.addToMap("#696969", "Dim gray");
Color.addToMap("#9B7653", "Dirt");
Color.addToMap("#1E90FF", "Dodger blue");
Color.addToMap("#D71868", "Dogwood rose");
Color.addToMap("#85BB65", "Dollar bill");
Color.addToMap("#664C28", "Donkey Brown");
Color.addToMap("#00009C", "Duke blue");
Color.addToMap("#E5CCC9", "Dust storm");
Color.addToMap("#EFDFBB", "Dutch white");
Color.addToMap("#E1A95F", "Earth yellow");
Color.addToMap("#555D50", "Ebony");
Color.addToMap("#1B1B1B", "Eerie black");
Color.addToMap("#614051", "Eggplant");
Color.addToMap("#F0EAD6", "Eggshell");
Color.addToMap("#1034A6", "Egyptian blue");
Color.addToMap("#7DF9FF", "Electric blue");
Color.addToMap("#FF003F", "Electric crimson");
Color.addToMap("#00FF00", "Electric green");
Color.addToMap("#6F00FF", "Electric indigo");
Color.addToMap("#CCFF00", "Electric lime");
Color.addToMap("#BF00FF", "Electric purple");
Color.addToMap("#3F00FF", "Electric ultramarine");
Color.addToMap("#FFFF00", "Electric yellow");
Color.addToMap("#50C878", "Emerald");
Color.addToMap("#6C3082", "Eminence");
Color.addToMap("#1B4D3E", "English green");
Color.addToMap("#B48395", "English lavender");
Color.addToMap("#AB4B52", "English red");
Color.addToMap("#563C5C", "English violet");
Color.addToMap("#96C8A2", "Eton blue");
Color.addToMap("#44D7A8", "Eucalyptus");
Color.addToMap("#801818", "Falu red");
Color.addToMap("#B53389", "Fandango");
Color.addToMap("#DE5285", "Fandango pink");
Color.addToMap("#F400A1", "Fashion fuchsia");
Color.addToMap("#E5AA70", "Fawn");
Color.addToMap("#4D5D53", "Feldgrau");
Color.addToMap("#4F7942", "Fern green");
Color.addToMap("#FF2800", "Ferrari Red");
Color.addToMap("#6C541E", "Field drab");
Color.addToMap("#B22222", "Firebrick");
Color.addToMap("#CE2029", "Fire engine red");
Color.addToMap("#E25822", "Flame");
Color.addToMap("#FC8EAC", "Flamingo pink");
Color.addToMap("#F7E98E", "Flavescent");
Color.addToMap("#EEDC82", "Flax");
Color.addToMap("#A2006D", "Flirt");
Color.addToMap("#FFFAF0", "Floral white");
Color.addToMap("#FFBF00", "Fluorescent orange");
Color.addToMap("#FF1493", "Fluorescent pink");
Color.addToMap("#FF004F", "Folly");
Color.addToMap("#014421", "Forest green");
Color.addToMap("#228B22", "Forest green (web)");
Color.addToMap("#856D4D", "French bistre");
Color.addToMap("#0072BB", "French blue");
Color.addToMap("#FD3F92", "French fuchsia");
Color.addToMap("#86608E", "French lilac");
Color.addToMap("#9EFD38", "French lime");
Color.addToMap("#FD6C9E", "French pink");
Color.addToMap("#4E1609", "French puce");
Color.addToMap("#C72C48", "French raspberry");
Color.addToMap("#F64A8A", "French rose");
Color.addToMap("#77B5FE", "French sky blue");
Color.addToMap("#8806CE", "French violet");
Color.addToMap("#AC1E44", "French wine");
Color.addToMap("#A6E7FF", "Fresh Air");
Color.addToMap("#FF77FF", "Fuchsia pink");
Color.addToMap("#CC397B", "Fuchsia purple");
Color.addToMap("#C74375", "Fuchsia rose");
Color.addToMap("#E48400", "Fulvous");
Color.addToMap("#CC6666", "Fuzzy Wuzzy");
Color.addToMap("#DCDCDC", "Gainsboro");
Color.addToMap("#E49B0F", "Gamboge");
Color.addToMap("#007F66", "Generic viridian");
Color.addToMap("#F8F8FF", "Ghost white");
Color.addToMap("#FE5A1D", "Giants orange");
Color.addToMap("#B06500", "Ginger");
Color.addToMap("#6082B6", "Glaucous");
Color.addToMap("#E6E8FA", "Glitter");
Color.addToMap("#00AB66", "GO green");
Color.addToMap("#D4AF37", "Gold (metallic)");
Color.addToMap("#FFD700", "Gold (web) (Golden)");
Color.addToMap("#85754E", "Gold Fusion");
Color.addToMap("#996515", "Golden brown");
Color.addToMap("#FCC200", "Golden poppy");
Color.addToMap("#FFDF00", "Golden yellow");
Color.addToMap("#DAA520", "Goldenrod");
Color.addToMap("#A8E4A0", "Granny Smith Apple");
Color.addToMap("#6F2DA8", "Grape");
Color.addToMap("#808080", "Gray");
Color.addToMap("#BEBEBE", "Gray (X11 gray)");
Color.addToMap("#465945", "Gray-asparagus");
Color.addToMap("#1CAC78", "Green (Crayola)");
Color.addToMap("#008000", "Green");
Color.addToMap("#00A877", "Green (Munsell)");
Color.addToMap("#009F6B", "Green (NCS)");
Color.addToMap("#00A550", "Green (pigment)");
Color.addToMap("#66B032", "Green (RYB)");
Color.addToMap("#ADFF2F", "Green-yellow");
Color.addToMap("#A99A86", "Grullo");
Color.addToMap("#663854", "Halaya ube");
Color.addToMap("#446CCF", "Han blue");
Color.addToMap("#5218FA", "Han purple");
Color.addToMap("#E9D66B", "Hansa yellow");
Color.addToMap("#3FFF00", "Harlequin");
Color.addToMap("#C90016", "Harvard crimson");
Color.addToMap("#DA9100", "Harvest gold");
Color.addToMap("#DF73FF", "Heliotrope");
Color.addToMap("#AA98A9", "Heliotrope gray");
Color.addToMap("#F0FFF0", "Honeydew");
Color.addToMap("#006DB0", "Honolulu blue");
Color.addToMap("#49796B", "Hooker's green");
Color.addToMap("#FF1DCE", "Hot magenta");
Color.addToMap("#FF69B4", "Hot pink");
Color.addToMap("#71A6D2", "Iceberg");
Color.addToMap("#FCF75E", "Icterine");
Color.addToMap("#319177", "Illuminating Emerald");
Color.addToMap("#602F6B", "Imperial");
Color.addToMap("#002395", "Imperial blue");
Color.addToMap("#66023C", "Imperial purple");
Color.addToMap("#ED2939", "Imperial red");
Color.addToMap("#B2EC5D", "Inchworm");
Color.addToMap("#4C516D", "Independence");
Color.addToMap("#138808", "India green");
Color.addToMap("#CD5C5C", "Indian red");
Color.addToMap("#E3A857", "Indian yellow");
Color.addToMap("#4B0082", "Indigo");
Color.addToMap("#002FA7", "International Klein Blue");
Color.addToMap("#FF4F00", "International orange (aerospace)");
Color.addToMap("#BA160C", "International orange (engineering)");
Color.addToMap("#C0362C", "International orange (Golden Gate Bridge)");
Color.addToMap("#5A4FCF", "Iris");
Color.addToMap("#F4F0EC", "Isabelline");
Color.addToMap("#009000", "Islamic green");
Color.addToMap("#B2FFFF", "Italian sky blue");
Color.addToMap("#FFFFF0", "Ivory");
Color.addToMap("#00A86B", "Jade");
Color.addToMap("#9D2933", "Japanese carmine");
Color.addToMap("#264348", "Japanese indigo");
Color.addToMap("#5B3256", "Japanese violet");
Color.addToMap("#D73B3E", "Jasper");
Color.addToMap("#A50B5E", "Jazzberry jam");
Color.addToMap("#DA614E", "Jelly Bean");
Color.addToMap("#343434", "Jet");
Color.addToMap("#F4CA16", "Jonquil");
Color.addToMap("#8AB9F1", "Jordy blue");
Color.addToMap("#BDDA57", "June bud");
Color.addToMap("#29AB87", "Jungle green");
Color.addToMap("#4CBB17", "Kelly green");
Color.addToMap("#7C1C05", "Kenyan copper");
Color.addToMap("#3AB09E", "Keppel");
Color.addToMap("#C3B091", "Khaki");
Color.addToMap("#E79FC4", "Kobi");
Color.addToMap("#354230", "Kombu green");
Color.addToMap("#E8000D", "KU Crimson");
Color.addToMap("#087830", "La Salle Green");
Color.addToMap("#D6CADD", "Languid lavender");
Color.addToMap("#26619C", "Lapis lazuli");
Color.addToMap("#A9BA9D", "Laurel green");
Color.addToMap("#CF1020", "Lava");
Color.addToMap("#B57EDC", "Lavender (floral)");
Color.addToMap("#CCCCFF", "Lavender blue");
Color.addToMap("#FFF0F5", "Lavender blush");
Color.addToMap("#C4C3D0", "Lavender gray");
Color.addToMap("#9457EB", "Lavender indigo");
Color.addToMap("#EE82EE", "Lavender magenta");
Color.addToMap("#E6E6FA", "Lavender mist");
Color.addToMap("#FBAED2", "Lavender pink");
Color.addToMap("#967BB6", "Lavender purple");
Color.addToMap("#FBA0E3", "Lavender rose");
Color.addToMap("#7CFC00", "Lawn green");
Color.addToMap("#FFF700", "Lemon");
Color.addToMap("#FFFACD", "Lemon chiffon");
Color.addToMap("#CCA01D", "Lemon curry");
Color.addToMap("#FDFF00", "Lemon glacier");
Color.addToMap("#E3FF00", "Lemon lime");
Color.addToMap("#F6EABE", "Lemon meringue");
Color.addToMap("#FFF44F", "Lemon yellow");
Color.addToMap("#1A1110", "Licorice");
Color.addToMap("#545AA7", "Liberty");
Color.addToMap("#FDD5B1", "Light apricot");
Color.addToMap("#ADD8E6", "Light blue");
Color.addToMap("#B5651D", "Light brown");
Color.addToMap("#E66771", "Light carmine pink");
Color.addToMap("#F08080", "Light coral");
Color.addToMap("#93CCEA", "Light cornflower blue");
Color.addToMap("#F56991", "Light crimson");
Color.addToMap("#E0FFFF", "Light cyan");
Color.addToMap("#FF5CCD", "Light deep pink");
Color.addToMap("#C8AD7F", "Light French beige");
Color.addToMap("#F984EF", "Light fuchsia pink");
Color.addToMap("#FAFAD2", "Light goldenrod yellow");
Color.addToMap("#D3D3D3", "Light gray");
Color.addToMap("#90EE90", "Light green");
Color.addToMap("#FFB3DE", "Light hot pink");
Color.addToMap("#F0E68C", "Light khaki");
Color.addToMap("#D39BCB", "Light medium orchid");
Color.addToMap("#ADDFAD", "Light moss green");
Color.addToMap("#E6A8D7", "Light orchid");
Color.addToMap("#B19CD9", "Light pastel purple");
Color.addToMap("#FFB6C1", "Light pink");
Color.addToMap("#E97451", "Light red ochre");
Color.addToMap("#FFA07A", "Light salmon");
Color.addToMap("#FF9999", "Light salmon pink");
Color.addToMap("#20B2AA", "Light sea green");
Color.addToMap("#87CEFA", "Light sky blue");
Color.addToMap("#778899", "Light slate gray");
Color.addToMap("#B0C4DE", "Light steel blue");
Color.addToMap("#B38B6D", "Light taupe");
Color.addToMap("#FFFFE0", "Light yellow");
Color.addToMap("#C8A2C8", "Lilac");
Color.addToMap("#BFFF00", "Lime");
Color.addToMap("#32CD32", "Lime green");
Color.addToMap("#9DC209", "Limerick");
Color.addToMap("#195905", "Lincoln green");
Color.addToMap("#FAF0E6", "Linen");
Color.addToMap("#6CA0DC", "Little boy blue");
Color.addToMap("#B86D29", "Liver (dogs)");
Color.addToMap("#6C2E1F", "Liver");
Color.addToMap("#987456", "Liver chestnut");
Color.addToMap("#FFE4CD", "Lumber");
Color.addToMap("#E62020", "Lust");
Color.addToMap("#FF00FF", "Magenta");
Color.addToMap("#CA1F7B", "Magenta (dye)");
Color.addToMap("#D0417E", "Magenta (Pantone)");
Color.addToMap("#FF0090", "Magenta (process)");
Color.addToMap("#9F4576", "Magenta haze");
Color.addToMap("#AAF0D1", "Magic mint");
Color.addToMap("#F8F4FF", "Magnolia");
Color.addToMap("#C04000", "Mahogany");
Color.addToMap("#6050DC", "Majorelle Blue");
Color.addToMap("#0BDA51", "Malachite");
Color.addToMap("#979AAA", "Manatee");
Color.addToMap("#FF8243", "Mango Tango");
Color.addToMap("#74C365", "Mantis");
Color.addToMap("#880085", "Mardi Gras");
Color.addToMap("#800000", "Maroon");
Color.addToMap("#E0B0FF", "Mauve");
Color.addToMap("#915F6D", "Mauve taupe");
Color.addToMap("#EF98AA", "Mauvelous");
Color.addToMap("#4C9141", "May green");
Color.addToMap("#73C2FB", "Maya blue");
Color.addToMap("#E5B73B", "Meat brown");
Color.addToMap("#66DDAA", "Medium aquamarine");
Color.addToMap("#0000CD", "Medium blue");
Color.addToMap("#E2062C", "Medium candy apple red");
Color.addToMap("#AF4035", "Medium carmine");
Color.addToMap("#035096", "Medium electric blue");
Color.addToMap("#1C352D", "Medium jungle green");
Color.addToMap("#BA55D3", "Medium orchid");
Color.addToMap("#9370DB", "Medium purple");
Color.addToMap("#BB3385", "Medium red-violet");
Color.addToMap("#AA4069", "Medium ruby");
Color.addToMap("#3CB371", "Medium sea green");
Color.addToMap("#80DAEB", "Medium sky blue");
Color.addToMap("#7B68EE", "Medium slate blue");
Color.addToMap("#C9DC87", "Medium spring bud");
Color.addToMap("#00FA9A", "Medium spring green");
Color.addToMap("#674C47", "Medium taupe");
Color.addToMap("#48D1CC", "Medium turquoise");
Color.addToMap("#D9603B", "Pale vermilion");
Color.addToMap("#F8B878", "Mellow apricot");
Color.addToMap("#F8DE7E", "Mellow yellow");
Color.addToMap("#FDBCB4", "Melon");
Color.addToMap("#0A7E8C", "Metallic Seaweed");
Color.addToMap("#9C7C38", "Metallic Sunburst");
Color.addToMap("#E4007C", "Mexican pink");
Color.addToMap("#191970", "Midnight blue");
Color.addToMap("#004953", "Midnight green (eagle green)");
Color.addToMap("#FFC40C", "Mikado yellow");
Color.addToMap("#E3F988", "Mindaro");
Color.addToMap("#3EB489", "Mint");
Color.addToMap("#F5FFFA", "Mint cream");
Color.addToMap("#98FF98", "Mint green");
Color.addToMap("#FFE4E1", "Misty rose");
Color.addToMap("#73A9C2", "Moonstone blue");
Color.addToMap("#AE0C00", "Mordant red 19");
Color.addToMap("#8A9A5B", "Moss green");
Color.addToMap("#30BA8F", "Mountain Meadow");
Color.addToMap("#997A8D", "Mountbatten pink");
Color.addToMap("#18453B", "MSU Green");
Color.addToMap("#306030", "Mughal green");
Color.addToMap("#C54B8C", "Mulberry");
Color.addToMap("#FFDB58", "Mustard");
Color.addToMap("#317873", "Myrtle green");
Color.addToMap("#F6ADC6", "Nadeshiko pink");
Color.addToMap("#2A8000", "Napier green");
Color.addToMap("#FFDEAD", "Navajo white");
Color.addToMap("#000080", "Navy");
Color.addToMap("#FFA343", "Neon Carrot");
Color.addToMap("#FE4164", "Neon fuchsia");
Color.addToMap("#39FF14", "Neon green");
Color.addToMap("#214FC6", "New Car");
Color.addToMap("#D7837F", "New York pink");
Color.addToMap("#A4DDED", "Non-photo blue");
Color.addToMap("#059033", "North Texas Green");
Color.addToMap("#E9FFDB", "Nyanza");
Color.addToMap("#0077BE", "Ocean Boat Blue");
Color.addToMap("#CC7722", "Ochre");
Color.addToMap("#43302E", "Old burgundy");
Color.addToMap("#CFB53B", "Old gold");
Color.addToMap("#FDF5E6", "Old lace");
Color.addToMap("#796878", "Old lavender");
Color.addToMap("#673147", "Old mauve");
Color.addToMap("#867E36", "Old moss green");
Color.addToMap("#C08081", "Old rose");
Color.addToMap("#808000", "Olive");
Color.addToMap("#6B8E23", "Olive Drab #3");
Color.addToMap("#3C341F", "Olive Drab #7");
Color.addToMap("#9AB973", "Olivine");
Color.addToMap("#353839", "Onyx");
Color.addToMap("#B784A7", "Opera mauve");
Color.addToMap("#FF7F00", "Orange");
Color.addToMap("#FF7538", "Orange (Crayola)");
Color.addToMap("#FF5800", "Orange (Pantone)");
Color.addToMap("#FB9902", "Orange (RYB)");
Color.addToMap("#FFA500", "Orange (web)");
Color.addToMap("#FF9F00", "Orange peel");
Color.addToMap("#FF4500", "Orange-red");
Color.addToMap("#DA70D6", "Orchid");
Color.addToMap("#F2BDCD", "Orchid pink");
Color.addToMap("#FB4F14", "Orioles orange");
Color.addToMap("#414A4C", "Outer Space");
Color.addToMap("#FF6E4A", "Outrageous Orange");
Color.addToMap("#002147", "Oxford Blue");
Color.addToMap("#990000", "Crimson Red");
Color.addToMap("#006600", "Pakistan green");
Color.addToMap("#273BE2", "Palatinate blue");
Color.addToMap("#682860", "Palatinate purple");
Color.addToMap("#BCD4E6", "Pale aqua");
Color.addToMap("#AFEEEE", "Pale blue");
Color.addToMap("#987654", "Pale brown");
Color.addToMap("#9BC4E2", "Pale cerulean");
Color.addToMap("#DDADAF", "Pale chestnut");
Color.addToMap("#DA8A67", "Pale copper");
Color.addToMap("#ABCDEF", "Pale cornflower blue");
Color.addToMap("#E6BE8A", "Pale gold");
Color.addToMap("#EEE8AA", "Pale goldenrod");
Color.addToMap("#98FB98", "Pale green");
Color.addToMap("#DCD0FF", "Pale lavender");
Color.addToMap("#F984E5", "Pale magenta");
Color.addToMap("#FADADD", "Pale pink");
Color.addToMap("#DDA0DD", "Pale plum");
Color.addToMap("#DB7093", "Pale red-violet");
Color.addToMap("#96DED1", "Pale robin egg blue");
Color.addToMap("#C9C0BB", "Pale silver");
Color.addToMap("#ECEBBD", "Pale spring bud");
Color.addToMap("#BC987E", "Pale taupe");
Color.addToMap("#78184A", "Pansy purple");
Color.addToMap("#009B7D", "Paolo Veronese green");
Color.addToMap("#FFEFD5", "Papaya whip");
Color.addToMap("#E63E62", "Paradise pink");
Color.addToMap("#AEC6CF", "Pastel blue");
Color.addToMap("#836953", "Pastel brown");
Color.addToMap("#CFCFC4", "Pastel gray");
Color.addToMap("#77DD77", "Pastel green");
Color.addToMap("#F49AC2", "Pastel magenta");
Color.addToMap("#FFB347", "Pastel orange");
Color.addToMap("#DEA5A4", "Pastel pink");
Color.addToMap("#B39EB5", "Pastel purple");
Color.addToMap("#FF6961", "Pastel red");
Color.addToMap("#CB99C9", "Pastel violet");
Color.addToMap("#FDFD96", "Pastel yellow");
Color.addToMap("#FFE5B4", "Peach");
Color.addToMap("#FFCC99", "Peach-orange");
Color.addToMap("#FFDAB9", "Peach puff");
Color.addToMap("#FADFAD", "Peach-yellow");
Color.addToMap("#D1E231", "Pear");
Color.addToMap("#EAE0C8", "Pearl");
Color.addToMap("#88D8C0", "Pearl Aqua");
Color.addToMap("#B768A2", "Pearly purple");
Color.addToMap("#E6E200", "Peridot");
Color.addToMap("#1C39BB", "Persian blue");
Color.addToMap("#00A693", "Persian green");
Color.addToMap("#32127A", "Persian indigo");
Color.addToMap("#D99058", "Persian orange");
Color.addToMap("#F77FBE", "Persian pink");
Color.addToMap("#701C1C", "Persian plum");
Color.addToMap("#CC3333", "Persian red");
Color.addToMap("#FE28A2", "Persian rose");
Color.addToMap("#EC5800", "Persimmon");
Color.addToMap("#CD853F", "Peru");
Color.addToMap("#000F89", "Phthalo blue");
Color.addToMap("#123524", "Phthalo green");
Color.addToMap("#45B1E8", "Picton blue");
Color.addToMap("#C30B4E", "Pictorial carmine");
Color.addToMap("#FDDDE6", "Piggy pink");
Color.addToMap("#01796F", "Pine green");
Color.addToMap("#FFC0CB", "Pink");
Color.addToMap("#D74894", "Pink (Pantone)");
Color.addToMap("#FFDDF4", "Pink lace");
Color.addToMap("#D8B2D1", "Pink lavender");
Color.addToMap("#FF9966", "Pink-orange");
Color.addToMap("#E7ACCF", "Pink pearl");
Color.addToMap("#F78FA7", "Pink Sherbet");
Color.addToMap("#93C572", "Pistachio");
Color.addToMap("#E5E4E2", "Platinum");
Color.addToMap("#8E4585", "Plum");
Color.addToMap("#BE4F62", "Popstar");
Color.addToMap("#FF5A36", "Portland Orange");
Color.addToMap("#B0E0E6", "Powder blue");
Color.addToMap("#FF8F00", "Princeton orange");
Color.addToMap("#003153", "Prussian blue");
Color.addToMap("#DF00FF", "Psychedelic purple");
Color.addToMap("#CC8899", "Puce");
Color.addToMap("#644117", "Pullman Brown (UPS Brown)");
Color.addToMap("#FF7518", "Pumpkin");
Color.addToMap("#800080", "Deep purple");
Color.addToMap("#9F00C5", "Purple (Munsell)");
Color.addToMap("#A020F0", "Purple");
Color.addToMap("#69359C", "Purple Heart");
Color.addToMap("#9678B6", "Purple mountain majesty");
Color.addToMap("#4E5180", "Purple navy");
Color.addToMap("#FE4EDA", "Purple pizzazz");
Color.addToMap("#50404D", "Purple taupe");
Color.addToMap("#9A4EAE", "Purpureus");
Color.addToMap("#51484F", "Quartz");
Color.addToMap("#436B95", "Queen blue");
Color.addToMap("#E8CCD7", "Queen pink");
Color.addToMap("#8E3A59", "Quinacridone magenta");
Color.addToMap("#FF355E", "Radical Red");
Color.addToMap("#FBAB60", "Rajah");
Color.addToMap("#E30B5D", "Raspberry");
Color.addToMap("#E25098", "Raspberry pink");
Color.addToMap("#B3446C", "Raspberry rose");
Color.addToMap("#826644", "Raw umber");
Color.addToMap("#FF33CC", "Razzle dazzle rose");
Color.addToMap("#E3256B", "Razzmatazz");
Color.addToMap("#8D4E85", "Razzmic Berry");
Color.addToMap("#FF0000", "Red");
Color.addToMap("#EE204D", "Red (Crayola)");
Color.addToMap("#F2003C", "Red (Munsell)");
Color.addToMap("#C40233", "Red (NCS)");
Color.addToMap("#ED1C24", "Red (pigment)");
Color.addToMap("#FE2712", "Red (RYB)");
Color.addToMap("#A52A2A", "Red-brown");
Color.addToMap("#860111", "Red devil");
Color.addToMap("#FF5349", "Red-orange");
Color.addToMap("#E40078", "Red-purple");
Color.addToMap("#C71585", "Red-violet");
Color.addToMap("#A45A52", "Redwood");
Color.addToMap("#522D80", "Regalia");
Color.addToMap("#002387", "Resolution blue");
Color.addToMap("#777696", "Rhythm");
Color.addToMap("#004040", "Rich black");
Color.addToMap("#F1A7FE", "Rich brilliant lavender");
Color.addToMap("#D70040", "Rich carmine");
Color.addToMap("#0892D0", "Rich electric blue");
Color.addToMap("#A76BCF", "Rich lavender");
Color.addToMap("#B666D2", "Rich lilac");
Color.addToMap("#B03060", "Rich maroon");
Color.addToMap("#444C38", "Rifle green");
Color.addToMap("#704241", "Deep Roast coffee");
Color.addToMap("#00CCCC", "Robin egg blue");
Color.addToMap("#8A7F80", "Rocket metallic");
Color.addToMap("#838996", "Roman silver");
Color.addToMap("#F9429E", "Rose bonbon");
Color.addToMap("#674846", "Rose ebony");
Color.addToMap("#B76E79", "Rose gold");
Color.addToMap("#FF66CC", "Rose pink");
Color.addToMap("#C21E56", "Rose red");
Color.addToMap("#905D5D", "Rose taupe");
Color.addToMap("#AB4E52", "Rose vale");
Color.addToMap("#65000B", "Rosewood");
Color.addToMap("#D40000", "Rosso corsa");
Color.addToMap("#BC8F8F", "Rosy brown");
Color.addToMap("#0038A8", "Royal azure");
Color.addToMap("#002366", "Royal blue");
Color.addToMap("#4169E1", "Royal light blue");
Color.addToMap("#CA2C92", "Royal fuchsia");
Color.addToMap("#7851A9", "Royal purple");
Color.addToMap("#FADA5E", "Royal yellow");
Color.addToMap("#CE4676", "Ruber");
Color.addToMap("#D10056", "Rubine red");
Color.addToMap("#E0115F", "Ruby");
Color.addToMap("#9B111E", "Ruby red");
Color.addToMap("#FF0028", "Ruddy");
Color.addToMap("#BB6528", "Ruddy brown");
Color.addToMap("#E18E96", "Ruddy pink");
Color.addToMap("#A81C07", "Rufous");
Color.addToMap("#80461B", "Russet");
Color.addToMap("#679267", "Russian green");
Color.addToMap("#32174D", "Russian violet");
Color.addToMap("#B7410E", "Rust");
Color.addToMap("#DA2C43", "Rusty red");
Color.addToMap("#8B4513", "Saddle brown");
Color.addToMap("#FF6700", "Safety orange (blaze orange)");
Color.addToMap("#EED202", "Safety yellow");
Color.addToMap("#F4C430", "Saffron");
Color.addToMap("#BCB88A", "Sage");
Color.addToMap("#23297A", "St. Patrick's blue");
Color.addToMap("#FA8072", "Salmon");
Color.addToMap("#FF91A4", "Salmon pink");
Color.addToMap("#C2B280", "Sand");
Color.addToMap("#ECD540", "Sandstorm");
Color.addToMap("#F4A460", "Sandy brown");
Color.addToMap("#92000A", "Sangria");
Color.addToMap("#507D2A", "Sap green");
Color.addToMap("#0F52BA", "Sapphire");
Color.addToMap("#0067A5", "Sapphire blue");
Color.addToMap("#CBA135", "Satin sheen gold");
Color.addToMap("#FF2400", "Scarlet");
Color.addToMap("#FFD800", "School bus yellow");
Color.addToMap("#76FF7A", "Screamin' Green");
Color.addToMap("#006994", "Sea blue");
Color.addToMap("#2E8B57", "Sea green");
Color.addToMap("#321414", "Seal brown");
Color.addToMap("#FFF5EE", "Seashell");
Color.addToMap("#FFBA00", "Selective yellow");
Color.addToMap("#704214", "Sepia");
Color.addToMap("#8A795D", "Shadow");
Color.addToMap("#778BA5", "Shadow blue");
Color.addToMap("#FFCFF1", "Shampoo");
Color.addToMap("#009E60", "Shamrock green");
Color.addToMap("#8FD400", "Sheen Green");
Color.addToMap("#D98695", "Shimmering Blush");
Color.addToMap("#FC0FC0", "Shocking pink");
Color.addToMap("#882D17", "Sienna");
Color.addToMap("#C0C0C0", "Silver");
Color.addToMap("#ACACAC", "Silver chalice");
Color.addToMap("#5D89BA", "Silver Lake blue");
Color.addToMap("#C4AEAD", "Silver pink");
Color.addToMap("#BFC1C2", "Silver sand");
Color.addToMap("#CB410B", "Sinopia");
Color.addToMap("#007474", "Skobeloff");
Color.addToMap("#87CEEB", "Sky blue");
Color.addToMap("#CF71AF", "Sky magenta");
Color.addToMap("#6A5ACD", "Slate blue");
Color.addToMap("#708090", "Slate gray");
Color.addToMap("#C84186", "Smitten");
Color.addToMap("#738276", "Smoke");
Color.addToMap("#933D41", "Smokey topaz");
Color.addToMap("#100C08", "Smoky black");
Color.addToMap("#FFFAFA", "Snow");
Color.addToMap("#CEC8EF", "Soap");
Color.addToMap("#893843", "Solid pink");
Color.addToMap("#757575", "Sonic silver");
Color.addToMap("#9E1316", "Spartan Crimson");
Color.addToMap("#1D2951", "Space cadet");
Color.addToMap("#807532", "Spanish bistre");
Color.addToMap("#0070B8", "Spanish blue");
Color.addToMap("#D10047", "Spanish carmine");
Color.addToMap("#E51A4C", "Spanish crimson");
Color.addToMap("#989898", "Spanish gray");
Color.addToMap("#009150", "Spanish green");
Color.addToMap("#E86100", "Spanish orange");
Color.addToMap("#F7BFBE", "Spanish pink");
Color.addToMap("#E60026", "Spanish red");
Color.addToMap("#4C2882", "Spanish violet");
Color.addToMap("#007F5C", "Spanish viridian");
Color.addToMap("#0FC0FC", "Spiro Disco Ball");
Color.addToMap("#A7FC00", "Spring bud");
Color.addToMap("#00FF7F", "Spring green");
Color.addToMap("#007BB8", "Star command blue");
Color.addToMap("#4682B4", "Steel blue");
Color.addToMap("#CC33CC", "Steel pink");
Color.addToMap("#4F666A", "Stormcloud");
Color.addToMap("#E4D96F", "Straw");
Color.addToMap("#FC5A8D", "Strawberry");
Color.addToMap("#FFCC33", "Sunglow");
Color.addToMap("#E3AB57", "Sunray");
Color.addToMap("#FAD6A5", "Sunset");
Color.addToMap("#FD5E53", "Sunset orange");
Color.addToMap("#CF6BA9", "Super pink");
Color.addToMap("#D2B48C", "Tan");
Color.addToMap("#F94D00", "Tangelo");
Color.addToMap("#F28500", "Tangerine");
Color.addToMap("#FFCC00", "Tangerine yellow");
Color.addToMap("#483C32", "Dark Grayish Brown");
Color.addToMap("#8B8589", "Taupe gray");
Color.addToMap("#D0F0C0", "Tea green");
Color.addToMap("#F4C2C2", "Tea rose");
Color.addToMap("#008080", "Teal");
Color.addToMap("#367588", "Teal blue");
Color.addToMap("#99E6B3", "Teal deer");
Color.addToMap("#00827F", "Teal green");
Color.addToMap("#CF3476", "Telemagenta");
Color.addToMap("#CD5700", "Tenne");
Color.addToMap("#E2725B", "Terra cotta");
Color.addToMap("#D8BFD8", "Thistle");
Color.addToMap("#DE6FA1", "Thulian pink");
Color.addToMap("#FC89AC", "Tickle Me Pink");
Color.addToMap("#0ABAB5", "Tiffany Blue");
Color.addToMap("#E08D3C", "Tiger's eye");
Color.addToMap("#DBD7D2", "Timberwolf");
Color.addToMap("#EEE600", "Titanium yellow");
Color.addToMap("#FF6347", "Tomato");
Color.addToMap("#746CC0", "Toolbox");
Color.addToMap("#42B72A", "Toothpaste advert green");
Color.addToMap("#FFC87C", "Topaz");
Color.addToMap("#FD0E35", "Tractor red");
Color.addToMap("#00755E", "Tropical rain forest");
Color.addToMap("#0073CF", "True Blue");
Color.addToMap("#417DC1", "Tufts Blue");
Color.addToMap("#FF878D", "Tulip");
Color.addToMap("#DEAA88", "Tumbleweed");
Color.addToMap("#B57281", "Turkish rose");
Color.addToMap("#40E0D0", "Turquoise");
Color.addToMap("#00FFEF", "Turquoise blue");
Color.addToMap("#A0D6B4", "Turquoise green");
Color.addToMap("#7C4848", "Tuscan red");
Color.addToMap("#C09999", "Tuscany");
Color.addToMap("#8A496B", "Twilight lavender");
Color.addToMap("#0033AA", "UA blue");
Color.addToMap("#D9004C", "UA red");
Color.addToMap("#8878C3", "Ube");
Color.addToMap("#536895", "UCLA Blue");
Color.addToMap("#FFB300", "UCLA Gold");
Color.addToMap("#3CD070", "UFO Green");
Color.addToMap("#120A8F", "Ultramarine");
Color.addToMap("#4166F5", "Ultramarine blue");
Color.addToMap("#FF6FFF", "Ultra pink");
Color.addToMap("#635147", "Umber");
Color.addToMap("#FFDDCA", "Unbleached silk");
Color.addToMap("#5B92E5", "United Nations blue");
Color.addToMap("#B78727", "University of California Gold");
Color.addToMap("#FFFF66", "Unmellow yellow");
Color.addToMap("#7B1113", "UP Maroon");
Color.addToMap("#AE2029", "Upsdell red");
Color.addToMap("#E1AD21", "Urobilin");
Color.addToMap("#004F98", "USAFA blue");
Color.addToMap("#F77F00", "University of Tennessee Orange");
Color.addToMap("#D3003F", "Utah Crimson");
Color.addToMap("#F3E5AB", "Vanilla");
Color.addToMap("#F38FA9", "Vanilla ice");
Color.addToMap("#C5B358", "Vegas gold");
Color.addToMap("#C80815", "Venetian red");
Color.addToMap("#43B3AE", "Verdigris");
Color.addToMap("#E34234", "Medium vermilion");
Color.addToMap("#D9381E", "Vermilion");
Color.addToMap("#8F00FF", "Violet");
Color.addToMap("#7F00FF", "Violet (color wheel)");
Color.addToMap("#8601AF", "Violet (RYB)");
Color.addToMap("#324AB2", "Violet-blue");
Color.addToMap("#F75394", "Violet-red");
Color.addToMap("#40826D", "Viridian");
Color.addToMap("#009698", "Viridian green");
Color.addToMap("#922724", "Vivid auburn");
Color.addToMap("#9F1D35", "Vivid burgundy");
Color.addToMap("#DA1D81", "Vivid cerise");
Color.addToMap("#CC00FF", "Vivid orchid");
Color.addToMap("#00CCFF", "Vivid sky blue");
Color.addToMap("#FFA089", "Vivid tangerine");
Color.addToMap("#9F00FF", "Vivid violet");
Color.addToMap("#004242", "Warm black");
Color.addToMap("#A4F4F9", "Waterspout");
Color.addToMap("#645452", "Wenge");
Color.addToMap("#F5DEB3", "Wheat");
Color.addToMap("#FFFFFF", "White");
Color.addToMap("#F5F5F5", "White smoke");
Color.addToMap("#A2ADD0", "Wild blue yonder");
Color.addToMap("#D470A2", "Wild orchid");
Color.addToMap("#FF43A4", "Wild Strawberry");
Color.addToMap("#FC6C85", "Wild watermelon");
Color.addToMap("#FD5800", "Willpower orange");
Color.addToMap("#A75502", "Windsor tan");
Color.addToMap("#722F37", "Wine");
Color.addToMap("#C9A0DC", "Wisteria");
Color.addToMap("#C19A6B", "Wood brown");
Color.addToMap("#738678", "Xanadu");
Color.addToMap("#0F4D92", "Yale Blue");
Color.addToMap("#1C2841", "Yankees blue");
Color.addToMap("#FCE883", "Yellow (Crayola)");
Color.addToMap("#EFCC00", "Yellow (Munsell)");
Color.addToMap("#FEDF00", "Yellow (Pantone)");
Color.addToMap("#FEFE33", "Yellow");
Color.addToMap("#9ACD32", "Yellow Green");
Color.addToMap("#FFAE42", "Yellow Orange");
Color.addToMap("#FFF000", "Yellow rose");
Color.addToMap("#0014A8", "Zaffre");
Color.addToMap("#2C1608", "Zinnwaldite brown");
Color.addToMap("#39A78E", "Zomp");














Color.addToMap("#4285F4", "Google blue")
Color.addToMap("#34A853", "Google green")
Color.addToMap("#EA4335", "Google red")
Color.addToMap("#FBBC05", "Google yellow")

Color.addToMap("#00aaff", "isaacOS futuristic cyan")
Color.addToMap(`#381724`, `shadowOS's default dark sienna`)
Color.addToMap(`#dd7cb1`, `PJiggles pink`)

Color.addToMap("#00a5ef", "Microsoft blue")
Color.addToMap("#f24f1c", "Microsoft red")
Color.addToMap("#80bb00", "Microsoft green")

Color.addToMap("#0019b6", "MS-DOS dark blue")
Color.addToMap("#00b6b8", "MS-DOS dark cyan")
Color.addToMap("#686868", "MS-DOS dark gray")
Color.addToMap("#00b41d", "MS-DOS dark green")
Color.addToMap("#c12bb6", "MS-DOS dark magenta")
Color.addToMap("#c41f0c", "MS-DOS dark red")
Color.addToMap("#c16a14", "MS-DOS dark yellow")
Color.addToMap("#5f6efc", "MS-DOS blue")
Color.addToMap("#24fcfe", "MS-DOS cyan")
Color.addToMap("#b8b8b8", "MS-DOS gray")
Color.addToMap("#3afa6f", "MS-DOS green")
Color.addToMap("#ff76fd", "MS-DOS magenta")
Color.addToMap("#ff706a", "MS-DOS red")
Color.addToMap("#fffd71", "MS-DOS yellow")

Color.addToMap("#C3C3C3", "MS Paint gray")
Color.addToMap("#880015", "MS Paint dark red")
Color.addToMap("#ED1C24", "MS Paint red")
Color.addToMap("#FF7F27", "MS Paint orange")
Color.addToMap("#FFF200", "MS Paint yellow")
Color.addToMap("#22B14C", "MS Paint green")
Color.addToMap("#00A2E8", "MS Paint turquoise")
Color.addToMap("#3F48CC", "MS Paint blue")
Color.addToMap("#A349A4", "MS Paint purple")
Color.addToMap("#7F7F7F", "MS Paint dark gray")
Color.addToMap("#B97A57", "MS Paint brown")
Color.addToMap("#FFAEC9", "MS Paint rose")
Color.addToMap("#FFC90E", "MS Paint gold")
Color.addToMap("#EFE4B0", "MS Paint light yellow")
Color.addToMap("#B5E61D", "MS Paint lime green")
Color.addToMap("#99D9EA", "MS Paint light turquoise")
Color.addToMap("#7092BE", "MS Paint blue-gray")
Color.addToMap("#C8BFE7", "MS Paint lavender")

Color.addToMap("#fdf6e3", "Solarized tan")
Color.addToMap("#eee8d5", "Solarized dark tan")
Color.addToMap("#24fcfe", "Solarized black")
Color.addToMap("#073642", "Solarized bright black")
Color.addToMap("#586e75", "Solarized gray (darkest)")
Color.addToMap("#657b83", "Solarized gray (dark)")
Color.addToMap("#839496", "Solarized gray (light)")
Color.addToMap("#93a1a1", "Solarized gray (lightest)")
Color.addToMap("#b58900", "Solarized yellow")
Color.addToMap("#cb4b16", "Solarized orange")
Color.addToMap("#dc322f", "Solarized red")
Color.addToMap("#d33682", "Solarized magenta")
Color.addToMap("#6c71c4", "Solarized violet")
Color.addToMap("#268bd2", "Solarized blue")
Color.addToMap("#2aa198", "Solarized cyan")
Color.addToMap("#859900", "Solarized green")

Color.addToMap("#d4d0c8", "Windows Classic grey")
Color.addToMap("#3a6ea5", "Windows Classic background blue")
Color.addToMap("#0a246a", "Windows Classic dark blue")
Color.addToMap("#a6caf0", "Windows Classic light blue")

Color.addToMap(`#F7AA1C`, `Miles Prower`)

Color.addToMap(`#05b07b`, `Windows 7 Leaves`)

Color.addToMap(`#663399`, `Rebecca Purple`)