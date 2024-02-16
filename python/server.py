from flask import Flask, jsonify
import requests
import html
import re
from collections import OrderedDict

app = Flask(__name__)
pokemon_names = None

class PokemonNames():
    def __init__(self) -> None:
        self.pokemon_arr = []
        self.pokemon_families = {}
        self.gen_bulbaurl = 'https://bulbapedia.bulbagarden.net/wiki/List_of_{}_Pok%C3%A9mon_names'
        self.fam_bulbaurl = 'https://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_evolution_family'
        ## Test the REGEX on https://regex101.com/
        self.languages = [
            {'name': 'English',                 'searchregex': '\\(Pokémon\\)">(.{1,15})<\\/a><',   'code': 'EN'},
            {'name': 'Japanese',                'searchregex': 'title="ja:(.{1,15})".*',         'code': 'JA'},
            {'name': 'German',                  'searchregex': 'title="de:(.{1,15})".*',         'code': 'DE'},
            {'name': 'French',                  'searchregex': 'title="fr:(.{1,15})".*',         'code': 'FR'},
            {'name': 'Spanish',                 'searchregex': 'title="es:(.{1,15})".*',         'code': 'ES'},
            {'name': 'Italian',                 'searchregex': 'title="it:(.{1,15})".*',         'code': 'IT'},
            {'name': 'Korean',                  'searchregex': 'lang="ko">(.{1,15}).*',          'code': 'KO'},
            {'name': 'Chinese',                 'searchregex': 'lang="zh">(.{1,15})<',           'code': 'ZHS'},
            {'name': 'Chinese',                 'searchregex': 'lang="zh">(.{1,15})<',           'code': 'ZHT'},
            {'name': 'Brazilian_Portuguese',    'searchregex': 'lang="br">(.{1,15}).*',          'code': 'PT'},
            {'name': 'Turkish',                 'searchregex': 'lang="tr">(.{1,15}).*',          'code': 'TR'},
            {'name': 'Russian',                 'searchregex': 'lang="ru">(.{1,15}).*',          'code': 'RU'},
            {'name': 'Thai',                    'searchregex': 'lang="th">(.{1,15}).*',          'code': 'TH'},
            {'name': 'Hindi',                   'searchregex': 'lang="hi">(.{1,15}).*',          'code': 'HI'}
        ]
        self.initialize_pokemon_families()
        self.initialize_pokemon_list()

    def get_pokemon_region(self, dex_number: int) -> str:
        if (dex_number >= 1 and dex_number <= 151):
            return "kanto"
        elif (dex_number >= 152 and dex_number <= 251):
            return "johto"
        elif (dex_number >= 252 and dex_number <= 386):
            return "hoenn"
        elif (dex_number >= 387 and dex_number <= 493):
            return "sinnoh"
        elif (dex_number >= 494 and dex_number <= 649):
            return "unova"
        elif (dex_number >= 650 and dex_number <= 721):
            return "kalos"
        elif (dex_number >= 722 and dex_number <= 807):
            return "alola"
        elif (dex_number >= 810 and dex_number <= 898):
            return "galar"
        elif (dex_number >= 899 and dex_number <= 905):
            return "hisui"
        elif (dex_number >= 906 and dex_number <= 1025):
            return "paldea"
        else:
            return "unknown"
    
    ## Tag Pokemon if they're one of the categories based on Pokemon GO's search phrase keywords
    ## https://leidwesen.github.io/SearchPhrases/
    def get_pokemon_keyword(self, dex_number: int) -> [str]:
        ## Specific catagories of Pokemon
        legendary_pokemon = [144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481, 482, 483, 484, 485, 486, 487, 488, 638, 639, 640, 641, 642, 643, 644, 645, 646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024]
        mythical_pokemon = [151, 251, 385, 386, 489, 490, 491, 492, 493, 494, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 893, 1025]
        ultra_beasts = [793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806]
        paradox_pokemon = [984, 985, 986, 987, 988, 989, 1005, 1007, 1020, 1021, 990, 991, 992, 993, 994, 995, 1006, 1008, 1010, 1022, 1023]
        starter_pokemon = [1, 2, 3, 4, 5, 6, 7, 8 , 9, 25, 133, 152, 153, 154, 155, 156, 157, 158, 159, 160, 252, 253, 254, 255, 256, 257, 258, 259, 260, 387, 388, 389, 390, 391, 392, 393, 394, 395, 495, 496, 497, 498, 499, 500, 501, 502, 503, 650, 651, 652, 653, 654, 655, 656, 657, 658, 722, 723, 724, 725, 726, 727, 728,  729, 730, 810, 811, 812, 813, 814, 815, 816, 817, 818, 906, 907, 908, 909, 910, 911, 912, 913, 914]
        baby_pokemon = [172, 173, 174, 175, 236, 238, 239, 240, 298, 360, 406, 433, 438, 439, 440, 446, 447, 458, 848]
        fossil_pokemon = [138, 139, 140, 141, 142, 345, 346, 347, 348, 408, 409, 410, 564, 565, 566, 567, 696, 697, 698, 699, 880, 881, 882, 883]
        pseudo_legendary_pokemon = [147, 148, 149, 246, 247, 248, 371, 372, 373, 374, 375, 376, 443, 444, 445, 633, 634, 635, 704, 705, 706, 782, 783, 784, 885, 886, 887, 996, 997, 998]
        mega_evolution_pokemon = [3, 6, 9, 15, 18, 65, 80, 94, 115, 127, 130, 142, 150, 181, 208, 212, 214, 229, 248, 254, 257, 260, 282, 302, 303, 306, 308, 310, 319, 323, 334, 354, 359, 362, 373, 376, 380, 381, 384, 428, 445, 448, 460, 475, 531, 719]
        gigantamax_pokemon = [3, 6, 9, 12, 25, 52, 68, 94, 99, 131, 133, 143, 569, 809, 812, 815, 818, 823, 826, 834, 839, 841, 842, 844, 849, 851, 858, 861, 869, 879, 884, 892]

        resulting_tags = []
        if (dex_number in legendary_pokemon):
            resulting_tags.extend(['legendary', 'legendaries'])
        if (dex_number in mythical_pokemon):
            resulting_tags.extend(['mythical', 'mythicals'])
        if (dex_number in baby_pokemon):
            resulting_tags.extend(['baby', 'babies', 'eggsonly', 'eggs only'])
        if (dex_number in ultra_beasts):
            resulting_tags.extend(['ultra beast', 'ultra beasts', 'ultrabeast'])
        if (dex_number in paradox_pokemon):
            resulting_tags.extend(['paradox', 'paradox pokemon', 'paradox pokémon'])
        if (dex_number in starter_pokemon):
            resulting_tags.extend(['starter'])
        if (dex_number in pseudo_legendary_pokemon):
            resulting_tags.extend(['psuedo', 'psuedo legendary'])
        if (dex_number in fossil_pokemon):
            resulting_tags.extend(['fossil'])
        if (dex_number in mega_evolution_pokemon):
            resulting_tags.extend(['mega', 'mega evolution', 'mega evolve'])
        if (dex_number in gigantamax_pokemon):
            resulting_tags.extend(['gigantamax'])
        
        return resulting_tags
        
    def get_pokemon_family(self, english_name: str) -> [str]:
        return self.pokemon_families[english_name]

    def initialize_pokemon_families(self) -> None:
        family_html = requests.get(self.fam_bulbaurl)
        family_html = html.unescape(family_html.text)

        current_pokemon_family = ''
        current_family_list = []

        for line in family_html.splitlines():
            pokemon_family = re.findall('>(.{1,15}) family', line)
            pokemon_name = re.findall('title="(.{1,15}) \\(Pok', line)

            ## While scanning you've found a Pokemon family
            if pokemon_family:
                ## You found another family. Add a new entry in the {} for Pokemon -> [family]
                if current_pokemon_family != '':
                    for pokemon in current_family_list:
                        ## Family names inside the array are lowercase for easier searching
                        self.pokemon_families[pokemon] = [x.lower() for x in list(set(current_family_list))]
                    current_family_list = []
                ## Set the Pokemon family for the first family found and all subsequent ones AFTER a reset
                current_pokemon_family = pokemon_family[0]
            ## You found a Pokemon in that family a few lines down
            if pokemon_name:
               current_family_list.append(pokemon_name[0])

    def initialize_pokemon_list(self) -> None:
        for language in self.languages:
            pokemon_html = requests.get(self.gen_bulbaurl.format(language['name']))
            pokemon_html = html.unescape(pokemon_html.text)
            current_language_pokemon_list = []

            current_pokemon_number = -1
            current_pokemon_name = ''
            current_pokemon_types = []
            skip_types = False

            for line in pokemon_html.splitlines():
                pokemon_number = re.findall('monospace">#(\\d*).*', line)
                pokemon_name = re.findall(language['searchregex'], line)

                ## Only do the types regex finds in English. Save on computation
                pokemon_type = None
                if language['name'] == 'English':
                    pokemon_type = re.findall('\\(type\\)" title="(.\\w{1,8}) \\(type\\)', line)

                ## While scanning you've found a Pokemon
                if pokemon_number:
                    ## You found another Pokemon. Reset the variables
                    if current_pokemon_number != -1:
                        current_language_pokemon_list.append({'number': int(current_pokemon_number), 'name': current_pokemon_name, 'types': current_pokemon_types})
                        current_pokemon_name = ''
                        current_pokemon_types = []
                    ## Set the number for the first Pokemon found and all subsequent ones AFTER a reset
                    current_pokemon_number = pokemon_number[0]
                ## You found a name for that Pokemon a few lines down
                if pokemon_name:
                    # You're on a new Pokemon. You can capture it's name and types
                    if current_pokemon_name == '':
                        current_pokemon_name = pokemon_name[0]
                        skip_types = False
                    # You're on the same Pokemon but a different form (Regional, Legendary, etc.) Do not capture it's types
                    else:
                        skip_types = True
                ## Capture the types only for the original form
                if pokemon_type and not skip_types:
                    current_pokemon_types.append(pokemon_type[0].lower())
            
            ## Hack to make sure the last Pokemon is added in too!
            current_language_pokemon_list.append({'number': int(current_pokemon_number), 'name': current_pokemon_name, 'types': current_pokemon_types})

            ## Initialilize dict w/ English data
            if language['name'] == 'English':
                for i in range(len(current_language_pokemon_list)):
                    english_name = current_language_pokemon_list[i]['name']
                    ## Filter out duplicate types just in case
                    english_types = list(set(current_language_pokemon_list[i]['types']))
                    ## Get all the families
                    english_family = self.get_pokemon_family(english_name)
                    ## Fixing all the names just to pull the images off pokemondb.net
                    english_name_html = english_name.lower()
                    ## Fix Nidoran ♀
                    if ("♀" in english_name):
                        english_name_html = english_name_html.replace("♀", "-f")
                    ## Fix Nidoran ♂
                    elif ("♂" in english_name):
                        english_name_html = english_name_html.replace("♂", "-m")
                    ## Fix Farfetch'd
                    elif ("\'" in english_name):
                        english_name_html = english_name_html.replace("\'", "")
                    ## Fix Mr. Mime and Mr. Rime
                    elif (". " in english_name):
                        english_name_html = english_name_html.replace(". ", "-")
                    ## Fix Mime Jr.
                    elif (" Jr." in english_name):
                        english_name_html = english_name_html.replace(" jr.", "-jr")
                    ## Fix Flabébé
                    elif ("é" in english_name):
                        english_name_html = english_name_html.replace("é", "e")
                    ## Fix Type: Null
                    elif (": " in english_name):
                        english_name_html = english_name_html.replace(": ", "-")   
                    ## Fix Paradox Pokemon (ex: Roaring Moon)
                    elif (" " in english_name):
                        english_name_html = english_name_html.replace(" ", "-")
                    pokemon_data = {
                        "id": i+1,
                        "name_EN": english_name,
                        "region_name": self.get_pokemon_region(i+1),
                        "keywords": self.get_pokemon_keyword(i+1),
                        "types": english_types,
                        "family": english_family,
                        "sprite_image": "https://img.pokemondb.net/sprites/home/normal/{}.png".format(english_name_html),
                        "shiny_sprite_image": "https://img.pokemondb.net/sprites/home/shiny/{}.png".format(english_name_html)
                    }
                    ## Ititialize all the names to English since most don't have explicit localizations
                    for language_i in self.languages:
                        pokemon_data['name_{}'.format(language_i['code'])] = english_name
                    self.pokemon_arr.append(pokemon_data)
            ## Run through the remaining languages
            else:
                for pokemon in current_language_pokemon_list:
                    self.pokemon_arr[pokemon['number']-1]['name_{}'.format(language['code'])] = pokemon['name']

@app.route('/pokemon_names', methods=['GET'])
def pokemon_names() -> list:
    resp = jsonify(pokemon_names.pokemon_arr)
    resp.status_code = 200
    return resp

if __name__ == "__main__":
    pokemon_names = PokemonNames()
    app.run()