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
        self.bulbaurl = 'https://bulbapedia.bulbagarden.net/wiki/List_of_{}_Pok%C3%A9mon_names'
        ## Test the REGEX on https://regex101.com/
        self.languages = [
            {'name': 'English',                 'searchregex': '\\(Pokémon\\)">(.{1,15})<\\/a><',  'code': 'EN'},
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
        self.initialize_list()

    def get_pokemon_region(self, dex_number: int) -> int:
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
    def get_pokemon_keyword(self, dex_number: int) -> str:
        ## Specific catagories of Pokemon
        legendary_pokemon = [144, 145, 146, 150, 243, 244, 245, 249, 250, 377, 378, 379, 380, 381, 382, 383, 384, 480, 481, 482, 483, 484, 485, 486, 487, 488, 494, 638, 639, 640, 641, 642, 643, 644, 645, 646, 716, 717, 718, 772, 773, 785, 786, 787, 788, 789, 790, 791, 792, 800, 888, 889, 890, 891, 892, 894, 895, 896, 897, 898, 905, 1001, 1002, 1003, 1004, 1007, 1008, 1014, 1015, 1016, 1017, 1024]
        mythical_pokemon = [151, 251, 385, 386, 489, 490, 491, 492, 493, 647, 648, 649, 719, 720, 721, 801, 802, 807, 808, 809, 893, 1025]
        baby_pokemon = [172, 173, 174, 175, 236, 238, 239, 240, 298, 360, 406, 433, 438, 439, 440, 446, 447, 458, 848]
        ultra_beasts = [793, 794, 795, 796, 797, 798, 799, 803, 804, 805, 806]
        paradox_pokemon = [984, 985, 986, 987, 988, 989, 1005, 1007, 1020, 1021, 990, 991, 992, 993, 994, 995, 1006, 1008, 1010, 1022, 1023]

        if (dex_number in legendary_pokemon):
            return ['legendary', 'legendaries']
        elif (dex_number in mythical_pokemon):
            return ['mythical', 'mythicals']
        elif (dex_number in baby_pokemon):
            return ['baby', 'babies', 'eggsonly', 'eggs only']
        elif (dex_number in ultra_beasts):
            return ['ultra beast', 'ultra beasts', 'ultrabeast']
        elif (dex_number in paradox_pokemon):
            return ['paradox', 'paradox pokemon', 'paradox pokémon']
        else:
            return []

    ## TODO: Add region_num, type_1, type_2, family_name
    def initialize_list(self) -> None:
        for language in self.languages:
            pokemon_html = requests.get(self.bulbaurl.format(language['name']))
            pokemon_html = html.unescape(pokemon_html.text)
            pokemon_names = []
            current_number = -1
            for line in pokemon_html.splitlines():
                pokemon_number = re.findall('monospace">#(\\d*).*', line)
                individual_pokemon = re.findall(language['searchregex'], line)
                if pokemon_number:
                    current_number = pokemon_number[0]
                if individual_pokemon:
                    pokemon_names.append({'number': int(current_number), 'name': individual_pokemon[0]})
            ## Initialilize dict w/ English data
            if language['name'] == 'English':
                pokemon_names = list({(item['number'], item['name']): item for item in pokemon_names}.values())
                for i in range(len(pokemon_names)):
                    english_name = pokemon_names[i]['name']
                    ## Lowercase for the images on pokemondb.net
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
                        "keywords": self.get_pokemon_keyword(i+1)
                        # "sprite_image": "https://img.pokemondb.net/sprites/home/normal/{}.png".format(english_name_html)
                    }
                    ## Ititialize all the names to English since most don't have explicit localizations
                    for language_i in self.languages:
                        pokemon_data['name_{}'.format(language_i['code'])] = english_name
                    self.pokemon_arr.append(pokemon_data)
            ## Run through the remaining languages
            else:
                for pokemon in pokemon_names:
                    self.pokemon_arr[pokemon['number']-1]['name_{}'.format(language['code'])] = pokemon['name']

@app.route('/pokemon_names', methods=['GET'])
def pokemon_names() -> list:
    resp = jsonify(pokemon_names.pokemon_arr)
    resp.status_code = 200
    return resp

if __name__ == "__main__":
    pokemon_names = PokemonNames()
    app.run()