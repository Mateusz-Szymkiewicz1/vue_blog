-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Cze 02, 2024 at 10:03 AM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `vue_blog`
--
DROP DATABASE IF EXISTS `vue_blog`;
CREATE DATABASE IF NOT EXISTS `vue_blog` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vue_blog`;

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `posty`
--

CREATE TABLE `posty` (
  `id` int(11) NOT NULL,
  `tytul` text NOT NULL,
  `tresc` text NOT NULL,
  `data` date NOT NULL,
  `tagi` text NOT NULL,
  `img` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `posty`
--

INSERT INTO `posty` (`id`, `tytul`, `tresc`, `data`, `tagi`, `img`) VALUES
(1, 'Moj pierwszy post', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora dolore eius vel, laboriosam doloremque cumque corporis consequuntur vero sit accusamus alias magni sint explicabo illum quo natus harum nobis quisquam, unde iure obcaecati eveniet autem molestiae. Consequuntur, cum qui. Nulla sint maxime, esse qui voluptate voluptas obcaecati nihil illo placeat.', '2024-06-25', '', ''),
(2, 'Moj drugi post', 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Tempora dolore eius vel, laboriosam doloremque cumque corporis consequuntur vero sit accusamus alias magni sint explicabo illum quo natus harum nobis quisquam, unde iure obcaecati eveniet autem molestiae. Consequuntur, cum qui. Nulla sint maxime, esse qui voluptate voluptas obcaecati nihil illo placeat.', '2024-06-18', '[\"smieszne\"]', 'photo.png');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `uzytkownicy`
--

CREATE TABLE `uzytkownicy` (
  `id` int(11) NOT NULL,
  `login` text NOT NULL,
  `haslo` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `posty`
--
ALTER TABLE `posty`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `posty`
--
ALTER TABLE `posty`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `uzytkownicy`
--
ALTER TABLE `uzytkownicy`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
