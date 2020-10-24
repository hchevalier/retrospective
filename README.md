# Retrospective

Retrospective allows to run remote agile retrospectives.

The reason behind its existence was to solve pain points my team and I came across while using other online retrospective services:

* Lack of exotic retrospective formats
* No one-by-one reflections revealing
* Lack of clear ownership of reflections once revealed
* No dedicated step for the team to gather around pending actions from previous sprints

## Table of Contents

- [Install](#install)
- [Usage](#usage)
- [Retrospective flow](#retrospective_flow)
- [Retrospective formats](#retrospective_formats)
- [Dashboard](#dashboard)
- [Groups](#groups)
- [Contributing](#contributing)
- [License](#license)

## Install

Clone the repository, then execute the following commands in the project folder:
```sh
bundle install
yarn install
rails db:setup
```

## Usage

```sh
bundle exec sidekiq -d
rails s
```

## Retrospective flow

A retrospective is composed of 6 steps.

1. Gathering
Group members gather in the lobby and can change their sticky notes' color.

2. Review of pending actions
This steps only triggers if at least one action from a previous retrospective from that group remains in "Todo" or "On hold" state.

In this case, this step allows to discuss these actions, re-assign them to another group member or change their state.

3. Thinking
During this step, group members are presented several zones.

They write reflections on sticky notes and chose in which zone they'll reveal each of them.

The facilator has control over the timer.

4. Revealing
In the revealing step, the facilitator gives a revealing token to group member in turn.

The revealer reveals his or her reflections one after the other in preferred order.

Reflections can be grouped into topics by anyone through a drag & drop action.

When all reflections have been revealed, the revealer drops his or her token. The facilitator gives it to the next group member.

When everyone revealed their reflections, the facilitator proceeds to the last step

5. Voting
Each team member receives 5 votes and can choose which reflection to spend his or her votes on.

The facilitator can see remaining votes for each participant in the participants list.

6. Actions
In this last step, the facilitator can see all reflections (or topics) that received at least one vote, with most voted one on top.

He or she selects the reflections in turn so that every group member can see which one is currently discussed.

Anyone can write an action for the currently discussed reflection.

## Retrospective formats

This tool currently implements the following formats:
* Glad Sad Mad
* Starfish
* Sailboat
* Traffic lights healthcheck
* Oscars and Gerards

The following ones will be added as soon as possible:
* Plus Minus Idea (PMI)
* Keep Add Less More (KALM)
* Drop Add Keep Improve (DAKI)
* Liked, Learned, Lacked, Longed for (4L)
* 2 truths and a lie

The following exotic ones are strongly considered:
* Postcard
* Dixit
* Timeline with emotion curve
* Day-Z
* Twitter
* Star Wars

## Dashboard

## Groups

## Contributing

See [the contributing file](CONTRIBUTING.md)

Teams run retrospectives their own way, there are chances the retrospective flow of this tool does not totally suit yours.

As long as they don't unnecessarily complexify the codebase and are optional, changes to the retrospective flow can be suggested.

## License

[AGPL V3 with the Commons Clause](LICENSE.txt)

## Credit

I'd like to thank my team at Doctolib for two reasons:
* they accepted to use this tool as early adopters, even though it was perfectible in many ways
* they contributed to it, either by coding features themselves or through their regular suggestions

Thank you a lot:
- Moustapha Sall
- Valentin Dewolf
- Jade Vandal
- Coralie Collignon
- Quentin Baudet
- Solène Brodu
- Clément Pinon

Also, I want to thank following SVG creators from the Noun Project:
- Ian Mawle for "Light Bulb"
- Alice Design for "chat" and "Megaphone"
- monkik for "avatar"
- Setyo Ari Wibowo for "random"
- Three Six Five for "Check"
- Bohdan Burmich for "Eye"
- ermankutlu for "link"
- Deemak Daksina for "Fullscreen"
- by Deemak Daksina for "Exit"
- Rakesh for "group"
- Hai Studio for "dashboard"
