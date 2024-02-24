import Footer from '../components/Footer';
import Borders from '../components/Borders';
import styles from './search-phrases.module.css';

export default function About() {
  return (
    <div className="base-container">
      <div className="base-content">
        <Borders />
        <div className={styles['grid-container']}>
          <div className={styles['grid']}>
            These are the various search phrases that can be used within the GO
            Copy search bar.
            <table className={styles['sp-table']}>
              <tbody>
                <tr>
                  <th>Phrase</th>
                  <th>Output</th>
                  <th>Examples</th>
                </tr>
                <tr>
                  <td>&#123;name&#125;</td>
                  <td>Pokémon with specified &#123;name&#125;.</td>
                  <td>tyranitar</td>
                </tr>
                <tr>
                  <td>+&#123;name&#125;</td>
                  <td>
                    All Pokémon in the same evolutionary family as
                    &#123;name&#125;.
                  </td>
                  <td>+larvitar</td>
                </tr>
                <tr>
                  <td>&#123;N&#125;</td>
                  <td>Pokémon with Pokédex number &#123;N&#125;.</td>
                  <td>150</td>
                </tr>
                <tr>
                  <td>&#123;A&#125; - &#123;B&#125;</td>
                  <td>
                    Pokémon with Pokédex number &#123;A&#125; through
                    &#123;B&#125;.
                  </td>
                  <td>1-151</td>
                </tr>
                <tr>
                  <td>&#123;type&#125;</td>
                  <td>
                    Pokémon with type &#123;type&#125;.
                    <br></br>
                    <b>Types:</b>{' '}
                    <i>
                      Normal, Fighting, Flying, Poison, Ground, Rock, Bug,
                      Ghost, Steel, Fire, Water, Grass, Electric, Psychic, Ice,
                      Dragon, Dark, Fairy
                    </i>
                  </td>
                  <td>dragon</td>
                </tr>
                <tr>
                  <td>&#123;region&#125;</td>
                  <td>
                    Pokémon from the &#123;region&#125; region.
                    <br></br>
                    <b>Regions:</b>{' '}
                    <i>
                      Kanto, Johto, Hoenn, Sinnoh, Unova, Kalos, Alola, Galar,
                      Hisui, Paldea, Unknown
                    </i>
                  </td>
                  <td>hoenn</td>
                </tr>
                <tr>
                  <td>&#123;keyword&#125;</td>
                  <td>
                    Pokémon that match a special &#123;keyword&#125;. <br></br>
                    <b>Keywords:</b>{' '}
                    <i>
                      Starter, Regional Rodent, Regional Bird, Regional Bug,
                      Pikaclone, Fossil, Psuedo Legendary, Legendary, Mythical,
                      Baby, Can Mega Evolve, Ultra Beast, Can Gigantamax,
                      Paradox, Region Exclusive
                    </i>
                  </td>
                  <td>starter</td>
                </tr>
                <tr>
                  <td>
                    &amp; or |<br></br>(AND)
                  </td>
                  <td>All Pokémon matching BOTH properties.</td>
                  <td>dark &amp; ground</td>
                </tr>
                <tr>
                  <td>
                    , or ; or :<br></br>(OR)
                  </td>
                  <td>All Pokémon matching EITHER property.</td>
                  <td>legendary, mythical</td>
                </tr>
                <tr>
                  <td>
                    !<br></br>(NOT)
                  </td>
                  <td>All Pokémon that do NOT have a property.</td>
                  <td>!starter</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
