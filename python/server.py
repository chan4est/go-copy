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
            {'name': 'English',     'searchregex': 'title=\\"([^(]*) \\(Pokémon\\)',    'code': 'EN'},
            {'name': 'Japanese',    'searchregex': '.*title="ja:([^(]*)".*',            'code': 'JA'},
            # {'name': 'German',      'searchregex': '', 'code': 'DE'},
            # {'name': 'French',      'searchregex': '', 'code': 'FR'},
            # {'name': 'Spanish',     'searchregex': '', 'code': 'ES'},
            # {'name': 'Italian',     'searchregex': '', 'code': 'IT'},
            {'name': 'Korean',      'searchregex': '.*lang="ko">([^(]*).*',             'code': 'KO'},
            # {'name': 'Chinese',     'searchregex': '', 'code': 'ZHS'},
            # {'name': 'Chinese',     'searchregex': '', 'code': 'ZHT'},
            # {'name': 'Portuguese',  'searchregex': '', 'code': 'PT'},
            # {'name': 'Turkish',     'searchregex': '', 'code': 'TR'},
            # {'name': 'Russian',     'searchregex': '', 'code': 'RU'},
            # {'name': 'Thai',        'searchregex': '', 'code': 'TH'},
            # {'name': 'Hindi',       'searchregex': '', 'code': 'HI'}
        ]
        self.initialize_list()
    
    def initialize_list(self) -> None:
        for language in self.languages:
            pokemon_html = requests.get(self.bulbaurl.format(language['name']))
            pokemon_html = html.unescape(pokemon_html.text)
            pokemon_names = []
            for line in pokemon_html.splitlines():
                individual_pokemon = re.findall(language['searchregex'], line)
                if individual_pokemon:
                    pokemon_names.append(individual_pokemon[0])
            ## Initialilize dict w/ English data
            if language['name'] == 'English':
                ## Trim off the first because it's Victini for some reason
                pokemon_names = pokemon_names[1:len(pokemon_names)]
                ## Remove the duplicate forms (ex: Alolan Rattata)
                pokemon_names = list(OrderedDict.fromkeys(pokemon_names))
                for i in range(len(pokemon_names)):
                    english_name = pokemon_names[i]
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
                        "sprite_image": "https://img.pokemondb.net/sprites/home/normal/{}.png".format(english_name_html)
                    }
                    self.pokemon_arr.append(pokemon_data)
            ## Run through the remaining languages
            else:
                for i in range(len(pokemon_names)):
                    self.pokemon_arr[i]['name_{}'.format(language['code'])] = pokemon_names[i]

@app.route('/pokemon_names', methods=['GET'])
def pokemon_names() -> list:
    resp = jsonify(pokemon_names.pokemon_arr)
    resp.status_code = 200
    return resp

if __name__ == "__main__":
    pokemon_names = PokemonNames()
    app.run()