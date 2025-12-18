# Structure
## Users
Possible to view a list of users filtered by a search parameter.
See: 
+ tournaments created by them
```json
{
    "username"  : "aleq",
    "name"      : "Alessandro",
    "surname"   : "Querenghi",
    "password"  : "secret"
}
```

## Field
Anyone can navigate available sport fields.  
View available time slots for a given date.  
```json
{
    "name" : "Santa maria",
    "sport" : "tennis",
    "address" : "via tommaso luciani TS",
    "slots" : []
}
```

## Bookings
Authenticated users can book any free time slot. **Slots cannot be booked more than once and users cannot book past slots.**  
Users may cancel upcoming bookings
```json
{
    "booking_ID"    : 13423,
    "user_ID"       : 23423,
    "field_ID"      : 3242,
    "slot"          : "lun-10-12"
}
```

## Tournaments
View all tournaments, either active or completed with support for search queries.  
Details include general information, teams matches and standings.  
View teams and players for each tournament.  
Creator may:
+ edit certain fields (name, max teams)
+ may delete tournament
+ add teams by specifying name.  

Authenticated users may create a tournament with:
```JSON
{
    "tournament_ID" : 34,
    "name"          : "ufc",
    "sport"         : "lotta libera",
    "maximum_teams" : 3,
    "start_date"    : "2026-01-88",
    "details"       : {
        "teams"     : [],
        "schedule"  : {}
    }
}
```

Schedule generation: single round-robin automatic schedule generation based on start.  
Schedule is a collection of matches.  

## Teams
Multiple players, each with:

```json
{
    "name"      : "aleq",
    "surname"   : "querenghi",
    "jersey_n"  : 12
}
```

Team:
```json
{
    "team_ID"   : 1,
    "name"      : "quaglie",
    "players"   : [],
    "sport"     : "lotta armata"
}
```

## Match
```json
{
    "match_ID"          : 1,
    "teams"             : [],
    "date"              : "2025-12-20",
    "optional_field"    : null,
    "status"            : "upcoming",
    "result"            : null
}
```

Results: creator final score once date has passed

## Search
Partial case-insensitive search for fields, tournaments, teams, players (cal returns: calcio, calisthenics arena, california team)

## Standing
Standings are computed automatically (depending on sport). Public.  
Match results
```json
{
    "score"             : 4,
    "mathcesPlayed"     : 2,
    "goals"             : [2, 3],
    "pointsDifference"  : -1
}
```

# REST

| method | API                                       | description                             |
| ------ | ----------------------------------------- | --------------------------------------- |
| POST   | /api/auth/signup                          | Register a new user                     |
| POST   | /api/auth/signin                          | User login                              |
| GET    | /api/fields?q=query                       | List of sports fields (searchable)      |
| GET    | /api/fields/:id                           | Field details                           |
| GET    | /api/fields/:id/slots?date=YYYY-MM-DD     | Availability for a specific date        |
| POST   | /api/fields/:id/bookings                  | Book a slot (authenticated)             |
| DELETE | /api/fields/:id/bookings/:bookingId       | Cancel a booking (authenticated)        |
| GET    | /api/tournaments?q=query                  | List of tournaments |
| POST   | /api/tournaments                          | Create a new tournament (authenticated) |
| GET    | /api/tournaments/:id                      | Tournament details |
| PUT    | /api/tournaments/:id                      | Edit tournament data |
| DELETE | /api/tournaments/:id                      | Delete the tournament (creator only) |
| POST   | /api/tournaments/:id/matches/generate     | Generate match schedule |
| GET    | /api/tournaments/:id/matches              | List matches |
| GET    | /api/matches/:id                          | Match details |
| PUT    | /api/matches/:id/result                   | Enter match result |
| GET    | /api/tournaments/:id/standings            | Tournament standings |
| GET    | /api/whoami                               | If authenticated, returns information about the current user |