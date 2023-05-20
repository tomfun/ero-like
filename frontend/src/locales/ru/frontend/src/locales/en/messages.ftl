welcome-message = Привет, { $name }! ! !
# Complex things are possible.
shared-photos =
    { $photoCount ->
        [few]
            { $userGender ->
                [male] { $userName } добавлено { $photoCount } новое фото to в его ленту.
                [female] { $userName } добавлено { $photoCount } новое фото to в её ленту.
               *[other] { $userName } добавлено { $photoCount } новое фото to в ленту.
            }
        [many]
            { $userGender ->
                [male] { $userName } добавлено { $photoCount } новых фото to в его ленту.
                [female] { $userName } добавлено { $photoCount } новых фото to в её ленту.
               *[other] { $userName } добавлено { $photoCount } новых фото to в ленту.
            }
       *[one]
            { $userGender ->
                [male] { $userName } добавлено новое фото to в его ленту.
                [female] { $userName } добавлено новое фото to в её ленту.
               *[other] { $userName } добавлено новое фото to в ленту.
            }
    }
