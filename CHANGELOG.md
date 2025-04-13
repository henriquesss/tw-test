# Changelog

### Changed
- `src/features/Header/ui/Header.tsx`: Replaced `dispatch(fetchUser)` with the username directly, according to the data received from the URL.
- `src/features/Header/ui/Header.tsx`: Changed the way to access the profile image attribute — from `profile-image` to `profileImage` — to match the system's expectations.
- `src/features/Header/state/user.thunk.ts`: Handled the conversion from `profile-image` to `profileImage`, according to the `IUser` interface.

### Added
- `src/features/TweetList/state/tweets.thunk.ts`: Added a filter to the API response to retrieve only the tweets from the provided username.
- Created pagination logic with a limit of 5 items per page (already functional).
- Added automated tests:
  - Installed `@testing-library/react-native@^9.1.0` for compatibility with the current React and React Native versions (around 2022).

### Fixed
- Fixed index errors when mapping tweets and images.
- Fixed Redux Thunk issue returning an Axios error instance.

### Misc
- Studied the API structure and how it interacts with the mobile app.
- Gained understanding of the `slice` and `thunk` pattern.
