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
- [Retrospective flow](#retrospective-flow)
- [Retrospective formats](#retrospective-formats)
- [Dashboard](#dashboard)
- [Groups](#groups)
- [Settings](#settings)
- [Contributing](#contributing)
- [License](#license)
- [Credit](#credit)

## Install

Clone the repository, then execute the following commands in the project folder:
```sh
bundle install
yarn install
rails db:setup
```

## Usage

```sh
bundle exec sidekiq
rails s
```

## Retrospective flow

A retrospective is composed of 6 steps.

### 1. Gathering
Group members gather in the lobby and can change their sticky notes' color or customize their avatar.

![Gathering step](docs/gathering.png?raw=true "Gathering step")

### 2. Review of pending actions
This steps only triggers if at least one action from a previous retrospective from that group remains in "Todo" or "On hold" state.

In this case, this step allows to discuss these actions, re-assign them to another group member or change their state.

![Review of pending actions](docs/review.png?raw=true "Review of pending actions")

### 3. Thinking
During this step, group members are presented several zones.

They write reflections on sticky notes and chose in which zone they'll reveal each of them.

The facilator has control over the timer.

![Thinking step](docs/thinking.png?raw=true "Thinking step")

### 4. Revealing
In the revealing step, the facilitator gives a revealing token to group member in turn.

The revealer reveals his or her reflections one after the other in preferred order.

Reflections can be grouped into topics by anyone through a drag & drop action.

When all reflections have been revealed, the revealer drops his or her token. The facilitator gives it to the next group member.

When everyone revealed their reflections, the facilitator proceeds to the last step

![Revealing step](docs/revealing.png?raw=true "Revealing step")

### 5. Voting
Each team member receives 5 votes and can choose which reflection to spend his or her votes on.

The facilitator can see remaining votes for each participant in the participants list.

![Voting step](docs/voting.png?raw=true "Voting step")

### 6. Actions
In this last step, the facilitator can see all reflections (or topics) that received at least one vote, with most voted one on top.

He or she selects the reflections in turn so that every group member can see which one is currently discussed.

Anyone can write an action for the currently discussed reflection.

![Actions step](docs/actions.png?raw=true "Actions step")

## Retrospective formats

This tool currently implements the following formats:
* Glad Sad Mad
* Plus Minus Interesting (PMI)
* Starfish
* Liked, Learned, Lacked, Longed for (4L)
* Sailboat
* Traffic lights healthcheck
* Oscars and Gerards

The following ones will be added as soon as possible:
* Keep Add Less More (KALM)
* Drop Add Keep Improve (DAKI)
* 2 truths and a lie

The following exotic ones are strongly considered:
* Postcard
* Dixit
* Timeline with emotion curve
* Day-Z
* Twitter
* Star Wars

## Dashboard

The dashboard displays all schedule retrospectives for your different groups, as well as any pending actions you are assigned to
![Dashboard](docs/dashboard.png?raw=true "Dashboard")

## Groups

You can create or join has many groups as you want

![Groups list](docs/groups.png?raw=true "Groups list")

When clicking on group, you can see its members list, pending invitations and actions.

Any group member can schedule the next retrospective or invite new group members

![Group view](docs/group.png?raw=true "Group view")

## Settings

The following settings are available through environment variables.

### Domains whitelist

Semi-colon-separated list of domain names that are allowed signin or signup. If empty or unset, no restriction is applied.

The check is done against the domain name of the email used to sign in or sign up.

In case of OAuth, the email of the account will be verified.
Example: `DOMAINS_WHITELIST=mydomain.fr;mydomain.com`

### Google Authentication

`GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` will be used as parameters for Google OAuth to allow signin or signup through Google.

If `GOOGLE_CLIENT_ID` is empty or unset, the feature is disabled.

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
- [Ian Mawle for "Light Bulb"](https://thenounproject.com/icon/18707/)
- [Alice Design for "chat"](https://thenounproject.com/icon/1956130/)
- [Alice Design for "Megaphone"](https://thenounproject.com/icon/3408475/)
- [Setyo Ari Wibowo for "random"](https://thenounproject.com/icon/868048/)
- [Three Six Five for "Check"](https://thenounproject.com/icon/1813702/)
- [Bohdan Burmich for "Eye"](https://thenounproject.com/icon/258303/)
- [ermankutlu for "link"](https://thenounproject.com/icon/1755198/)
- [Deemak Daksina for "Fullscreen"](https://thenounproject.com/icon/1393160/)
- [Deemak Daksina for "Exit Fullscreen"](https://thenounproject.com/icon/1404404/)
- [Rakesh for "group"](https://thenounproject.com/icon/1048770/)
- [Hai Studio for "dashboard"](https://thenounproject.com/icon/2678410/)
- [Rainbow Designs for "Arrow"](https://thenounproject.com/icon/2094735/)
- [Adrien Coquet for "thumb up"](https://thenounproject.com/icon/3139185/)
- [VM Design for "Star"](https://thenounproject.com/icon/2067040/)
- [Prettycons for "like"](https://thenounproject.com/icon/2079242/)
- [Meaghan Hendricks for "Brain"](https://thenounproject.com/icon/454654/)
- [Erik Arndt for "wish"](https://thenounproject.com/icon/2809529/)
- [Phoenix Dungeon for "ghost"](https://thenounproject.com/icon/2818227/)

And from [Flaticon](https://www.flaticon.com/)
- [Freepik for Idea, Drop, Keep Icons for DAKI retrospective](https://www.freepik.com)
- [Flaticon for Add icons for DAKI retrospective](https://www.flaticon.com/)
