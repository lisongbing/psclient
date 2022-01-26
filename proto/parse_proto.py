import os
import sys

protomap = {}
data = ''
f = open("gate.proto", "r+")
for line in f.readlines():
	if line.lstrip().startswith("import "):
		importFileName = line.lstrip()[6:].strip()
		importFileName = eval(importFileName.replace(";", ""))
		iptf = open(importFileName, "r+")
		line = iptf.read()
	data += line
f.close()


f = open("gate.temp", "w")
f.write(data)
f.close()

f = open("gate.temp", "r+")
line = f.readline()
linenum = 1
while line:
	if line.startswith("//@"):
		property = line.split(",")
		api = property[0].split(":")[1].strip()
		type = property[1].split(":")[1].strip().lower()
		nextline = f.readline()
		apiname = nextline.split("{")[0]
		apiname = apiname.replace("message", "").strip()
		if not protomap.has_key(api):
			content = {}
			content[type] = apiname;
			protomap[api] = content
		else:
			if protomap[api].has_key(type):
				print("[ERROR] api code[" + str(api) + "] " + type + " repeat! Please check file " + name + " line:" + str(linenum))
			protomap[api][type] = apiname;
		linenum = linenum + 1
	line = f.readline()
	linenum = linenum + 1
f.close()
	


f = open("ProtoMap.js", "w")
data = "module.exports = {\n\tregisterProtoMap() {\n\t\tlet protoMap = {\n"
items = protomap.items()
items.sort()
for k,v in items:
	data = data + "\t\t\t" + k + ": {\n"
	if v.has_key("req"):
		data = data + "\t\t\t\treq:" + "PB." + v["req"] + ",\n"
	if v.has_key("resp"):
		data = data + "\t\t\t\tresp:" + "PB." + v["resp"] + ",\n"
	data = data + "\t\t\t},\n"
data = data + "\t\t};\n\t\t return protoMap;\n\t}\n}"

f.write(data)
f.close()

#del //
data = ''
bsyntax = False
bpackage = False
f = open("gate.temp", "r+")
line = f.readline()
while line:
	if line.lstrip().startswith('syntax'):
		if bsyntax == False:
			bsyntax = True
		else:
			line = ''
	if line.lstrip().startswith('package'):
		if bpackage == False:
			bpackage = True
		else:
			line = ''
	if len(sys.argv) == 3 and sys.argv[1] == 'compress':
		if not (line.lstrip().startswith("//") or line.strip() == ''):
			sp = line.split("//")
			if sys.argv[2] == 'best':
				if len(sp) > 1:
					data = data + sp[0].strip()
				else:
					data = data + line.strip()
			else:
				if len(sp) > 1:
					data = data + sp[0].rstrip() + '\n'
				else:
					data = data + line.rstrip() + '\n'
		data = data.replace(' {', '{')
		data = data.replace('{ ', '{')
		data = data.replace('= ', '=')
		data = data.replace(' =', '=')
	else:
		data = data + line
	line = f.readline()
f.close()
f = open('gate.temp', "w")
f.write(data)
f.close()
