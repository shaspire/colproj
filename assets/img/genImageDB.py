from os import listdir
from json import dumps
def main():
	BACKGROUNDS = {}
	Files = (listdir("./"))
	for file in Files:
		if not file.endswith(".py"):
			BACKGROUNDS[file[:-4].capitalize()] = "./assets/img/"+file
	print(dumps(BACKGROUNDS,indent=4))

if __name__ == "__main__":
	main()


"AFTUYDAVYWUDS.prstoishes"