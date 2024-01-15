import { Text } from "react-native";
import Button from "../../components/Button";

export default function ButtonsMania() {
  return (
    <>
      <Text>Index</Text>
      <Button>Accueil</Button>
      <Button type="outline">Accueil</Button>
      <Button icon="home">Accueil</Button>
      <Button icon="home" type="outline">
        Accueil
      </Button>
      <Button prependIcon="home">Accueil</Button>
      <Button prependIcon="home" type="outline">
        Accueil
      </Button>
      <Button appendIcon="arrow-forward">Suivant</Button>
      <Button appendIcon="arrow-forward" type="outline">
        Suivant
      </Button>
      <Button size="small">Accueil</Button>
      <Button size="small" type="outline">
        Accueil
      </Button>
      <Button size="small" icon="home">
        Accueil
      </Button>
      <Button size="small" icon="home" type="outline">
        Accueil
      </Button>
      <Button size="small" prependIcon="home">
        Accueil
      </Button>
      <Button size="small" prependIcon="home" type="outline">
        Accueil
      </Button>
      <Button size="small" appendIcon="arrow-forward">
        Suivant
      </Button>
      <Button size="small" appendIcon="arrow-forward" type="outline">
        Suivant
      </Button>
    </>
  );
}
