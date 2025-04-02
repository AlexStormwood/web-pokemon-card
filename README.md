# Web Pokemon Card

Just a sandbox repo so I can try and build this one thing in particular, in isolation from a larger project. 

Not meant for actual usage in any particular project.

There'll be a nice, professional, proper package similar to this coming from the [BigfootDS](https://github.com/BigfootDS) account soon.

## Usage

Install the package:

`npm i @alexstormwood/web-pokemon-card`

Import the component and give it its needed data:

```jsx

import './App.css'
import CardRenderer from '@alexstormwood/web-pokemon-card'

function App() {

  return (
    <>
      <h1>Hello, world!</h1>
      <CardRenderer targetCardData={{
        "name": "bidoof",
        "illustrator": "Sekio",
        "types": [
          "basic"
        ],
        "resourceTypes": [
          "C"
        ],
        "rarity": "C",
        "resource1": "70",
        "resource2": "C",
        "actions": [
          {
            "isAbility": false,
            "name": "Headbutt",
            "cost": "CC",
            "output": "30",
            "modifier": "",
            "description": ""
          }
        ],
        "weakness": {
          "energyType": "F",
          "modifier": "+20"
        },
        "flavourText": "With nerves of steel, nothing can perturb it. It is more agile and active than it appears.",
        "imageUrls": [
          ""
        ]

      }}
        targetCardScale='20'
        targetDebugViewEnabled={false}
        targetCardDebugImage=''
      />
    </>
  )
}

export default App

```

## About

This repo contains a ReactJS component that renders data out into a Pokemon TCG card.

The card is built with HTML and CSS, scaling to whatever size you want. No more JPEG artifacts or pixelation from poor image resizing!

The component in this repo is built to the Pokemon TCG Pocket 2024-era of card designs.

## Further Reading

This, as an NPM package, was made following this article: 

- [Create a Component Library Fast 🚀 (using Vite's library mode), by Andreas Riedmüller, 11th August 2023](https://dev.to/receter/how-to-create-a-react-component-library-using-vites-library-mode-4lma)