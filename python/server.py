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