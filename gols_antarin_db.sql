-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Mar 20, 2022 at 02:37 PM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `gols_antarin_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `harga`
--

CREATE TABLE `harga` (
  `id` int(11) NOT NULL,
  `metode_antar` enum('Same-day','Express') NOT NULL,
  `min_jarak` double NOT NULL,
  `max_jarak` double NOT NULL,
  `harga_pasien` int(11) NOT NULL,
  `harga_driver` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `harga`
--

INSERT INTO `harga` (`id`, `metode_antar`, `min_jarak`, `max_jarak`, `harga_pasien`, `harga_driver`, `created_at`, `updated_at`) VALUES
(1, 'Same-day', 0, 3, 12000, 6000, '2022-02-28 12:20:19', '2022-02-28 12:46:56'),
(2, 'Same-day', 3.1, 8, 16000, 7000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(3, 'Same-day', 8.1, 14, 20000, 9000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(4, 'Same-day', 14.1, 20, 30000, 14000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(5, 'Same-day', 20.1, 25, 35000, 18000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(6, 'Same-day', 25.1, 30, 45000, 26000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(7, 'Same-day', 30.1, 35, 55000, 32000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(8, 'Same-day', 35.1, 40, 60000, 37000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(9, 'Same-day', 40.1, 45, 65000, 40000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(10, 'Same-day', 45.1, 50, 70000, 43000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(11, 'Same-day', 50.1, 55, 75000, 45000, '2022-02-28 12:20:19', '2022-02-28 12:20:19'),
(19, 'Express', 0, 3, 16000, 8000, '2022-02-28 12:44:07', '2022-02-28 12:46:58'),
(20, 'Express', 3.1, 8, 24000, 12000, '2022-02-28 12:44:07', '2022-02-28 12:44:07'),
(21, 'Express', 8.1, 14, 32000, 18000, '2022-02-28 12:44:07', '2022-02-28 12:44:07'),
(22, 'Express', 14.1, 20, 50000, 28000, '2022-02-28 12:44:07', '2022-02-28 12:44:07'),
(23, 'Express', 20.1, 25, 60000, 34000, '2022-02-28 12:44:07', '2022-02-28 12:44:07'),
(24, 'Express', 25.1, 30, 70000, 39000, '2022-02-28 12:44:07', '2022-02-28 12:44:07'),
(25, 'Express', 30.1, 35, 85000, 48000, '2022-02-28 12:44:07', '2022-02-28 12:44:07');

-- --------------------------------------------------------

--
-- Table structure for table `promo`
--

CREATE TABLE `promo` (
  `id` int(11) NOT NULL,
  `kode_promo` varchar(15) NOT NULL,
  `harga_potongan` int(11) NOT NULL,
  `max_jarak` double NOT NULL DEFAULT 55,
  `is_expired` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `promo`
--

INSERT INTO `promo` (`id`, `kode_promo`, `harga_potongan`, `max_jarak`, `is_expired`, `created_at`, `updated_at`) VALUES
(1, 'MERDEKA', 3000, 0, 1, '2022-02-27 13:03:52', '2022-02-27 18:37:09'),
(2, 'KDPRM', 3000, 0, 1, '2022-02-27 13:03:52', '2022-02-27 18:37:09'),
(3, 'ENDYEAR', 12000, 0, 0, '2022-02-27 13:03:52', '2022-02-27 18:37:09'),
(4, 'MERDEKA', 3000, 0, 1, '2022-03-18 07:08:37', '2022-03-19 04:14:05'),
(5, 'KDPRM', 5000, 0, 0, '2022-03-18 10:56:31', '2022-03-18 10:56:31'),
(6, 'KD', 1000, 0, 0, '2022-03-18 10:57:01', '2022-03-18 10:57:01'),
(7, 'DFGGHHH', 12000, 0, 1, '2022-03-18 11:00:49', '2022-03-19 04:14:13'),
(8, 'WEEE', 5000, 0, 0, '2022-03-18 11:02:58', '2022-03-18 11:02:58'),
(9, 'ES', 233, 0, 0, '2022-03-18 11:03:48', '2022-03-18 11:03:48'),
(10, 'QWE', 244, 0, 1, '2022-03-18 11:04:01', '2022-03-20 01:50:20'),
(11, 'WER', 233, 0, 0, '2022-03-18 11:05:00', '2022-03-18 11:05:00'),
(12, 'HUYRHV', 1255, 0, 1, '2022-03-20 01:58:41', '2022-03-20 01:58:52'),
(13, 'KJJJ', 1000, 55, 0, '2022-03-20 07:56:31', '2022-03-20 07:56:31'),
(14, 'KJ', 200, 3, 0, '2022-03-20 07:56:46', '2022-03-20 07:56:46');

-- --------------------------------------------------------

--
-- Table structure for table `riwayat`
--

CREATE TABLE `riwayat` (
  `id` int(11) NOT NULL,
  `transaksi_id` int(11) NOT NULL,
  `detail_riwayat` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `riwayat`
--

INSERT INTO `riwayat` (`id`, `transaksi_id`, `detail_riwayat`, `created_at`) VALUES
(1, 20, 'Menunggu pembayaran', '2022-02-26 19:03:51'),
(2, 20, 'Pembayaran selesai', '2022-02-26 19:03:51'),
(3, 21, 'Menunggu pembayaran', '2022-02-26 19:06:05'),
(4, 20, 'Obat sedang disiapkan', '2022-02-26 20:53:22'),
(5, 20, 'Obat siap diantarkan', '2022-02-26 20:53:49'),
(6, 25, 'Obat menunggu diambil oleh driver', '2022-03-19 08:30:28'),
(7, 24, 'Obat menunggu diambil oleh driver', '2022-03-19 08:44:36'),
(8, 24, 'Obat sedang diantar menuju alamat', '2022-03-19 08:44:41'),
(9, 24, 'Obat telah diterima oleh pelanggan', '2022-03-19 08:45:19'),
(10, 26, 'Obat menunggu diambil oleh driver', '2022-03-19 08:45:47'),
(11, 26, 'Obat sedang diantar menuju alamat', '2022-03-19 08:45:48'),
(12, 26, 'Obat telah diterima oleh pelanggan', '2022-03-19 08:45:49'),
(13, 28, 'Obat menunggu diambil oleh driver', '2022-03-19 08:51:57'),
(14, 28, 'Obat sedang diantar menuju alamat', '2022-03-19 08:51:58'),
(15, 20, 'Pembayaran lunas', '2022-03-19 10:16:22'),
(16, 25, 'Pembayaran lunas', '2022-03-19 10:16:33'),
(17, 24, 'Obat sedang diracik', '2022-03-19 10:35:00'),
(18, 24, 'Obat selesai diracik', '2022-03-19 10:35:20'),
(19, 24, 'Obat menunggu diambil oleh driver', '2022-03-19 10:35:30'),
(20, 25, 'Obat sedang diracik', '2022-03-19 10:36:09'),
(21, 20, 'Obat sedang diracik', '2022-03-19 10:36:18'),
(22, 26, 'Pembayaran lunas', '2022-03-19 10:36:59'),
(23, 21, 'Pembayaran lunas', '2022-03-19 10:51:34'),
(24, 21, 'Obat sedang diracik', '2022-03-19 11:08:27'),
(25, 21, 'Obat selesai diracik', '2022-03-19 11:08:33'),
(26, 21, 'Obat menunggu diambil oleh driver', '2022-03-19 11:08:38'),
(27, 21, 'Obat sedang diantar menuju alamat', '2022-03-19 11:08:44'),
(28, 21, 'Obat telah diterima oleh pelanggan', '2022-03-19 11:08:52'),
(29, 22, 'Obat sedang diracik', '2022-03-19 13:07:30'),
(30, 26, 'Obat sedang diracik', '2022-03-19 13:08:04'),
(31, 26, 'Obat selesai diracik', '2022-03-19 13:08:35'),
(32, 22, 'Obat selesai diracik', '2022-03-19 13:09:12'),
(33, 27, 'Pembayaran lunas', '2022-03-19 13:11:35'),
(34, 22, 'Obat menunggu diambil oleh driver', '2022-03-19 13:54:17'),
(35, 25, 'Obat selesai diracik', '2022-03-19 16:16:52'),
(36, 34, 'Pembayaran lunas', '2022-03-19 16:17:02'),
(37, 22, 'Obat sedang diantar menuju alamat', '2022-03-20 01:19:22'),
(38, 22, 'Obat telah diterima oleh pelanggan', '2022-03-20 01:19:32'),
(39, 34, 'Obat sedang diracik', '2022-03-20 01:48:50'),
(40, 34, 'Obat selesai diracik', '2022-03-20 01:49:01'),
(41, 27, 'Obat sedang diracik', '2022-03-20 02:09:50'),
(42, 27, 'Obat selesai diracik', '2022-03-20 02:09:57'),
(43, 27, 'Obat menunggu diambil oleh driver', '2022-03-20 02:10:01');

-- --------------------------------------------------------

--
-- Table structure for table `rs`
--

CREATE TABLE `rs` (
  `id` int(11) NOT NULL,
  `kode_rs` varchar(10) NOT NULL,
  `pin` varchar(100) NOT NULL,
  `is_cs` tinyint(1) NOT NULL,
  `nama_rs` varchar(150) NOT NULL,
  `alamat_rs` varchar(300) NOT NULL,
  `long_rs` double NOT NULL,
  `lat_rs` double NOT NULL,
  `font_size` int(5) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `rs`
--

INSERT INTO `rs` (`id`, `kode_rs`, `pin`, `is_cs`, `nama_rs`, `alamat_rs`, `long_rs`, `lat_rs`, `font_size`, `created_at`, `updated_at`) VALUES
(1, 'RSISH', '123456', 0, 'Rumah Sakit Islam Siti Haji', 'Sidoarjo', -7.45879, 112.723114, 14, '2022-02-25 20:18:17', '2022-03-19 16:03:51'),
(2, 'RSUDS', '123456', 1, 'Rumah Sakit Umum Daerah Sidoarjjj', 'Sidoarjo', -7.46524, 112.713455, 14, '2022-02-25 20:20:03', '2022-03-19 04:56:43'),
(9, 'RSLM', '155517', 0, 'Rumah Sakit Lavalette', 'Malang', 0.8, 20.33, 14, '2022-02-26 15:29:34', '2022-02-26 15:29:34'),
(11, 'RSLMM', '003978', 0, 'Rumah Sakit Lavalette', 'Malang', 0.8, 20.33, 14, '2022-03-18 06:55:13', '2022-03-18 06:55:13'),
(13, 'RSIMM', '234544', 0, 'Rumah Sakit Lavalette', 'Malang', 0.8, 20.33, 14, '2022-03-18 08:02:30', '2022-03-18 08:02:30'),
(14, 'RSAG', '111111', 1, 'Ru Sa An Gr', 'Gresik', -10, 20, 14, '2022-03-18 10:06:43', '2022-03-18 10:06:43'),
(15, 'RSAGG', '123456', 1, 'Ru Sa An Gre', 'Gresikk', -12, 22, 14, '2022-03-18 10:12:13', '2022-03-18 10:12:13'),
(16, 'RSAL', '123456', 1, 'Ru Sa Ang La', 'Surabaya', 1.1, 1.2, 12, '2022-03-19 16:02:11', '2022-03-19 16:02:11'),
(17, 'RSAA', '804276', 1, 'Ru Sa An Ann', 'Gresik', 1.2, 1, 12, '2022-03-19 16:06:44', '2022-03-19 16:07:26');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi`
--

CREATE TABLE `transaksi` (
  `id` int(11) NOT NULL,
  `rs_id` int(11) NOT NULL,
  `nama_pasien` varchar(50) NOT NULL,
  `alamat_pasien` varchar(300) NOT NULL,
  `long_pasien` double NOT NULL,
  `lat_pasien` double NOT NULL,
  `telp_pasien` varchar(25) NOT NULL,
  `no_antrian` int(11) NOT NULL,
  `no_resi` varchar(50) NOT NULL,
  `jarak_antar` double NOT NULL,
  `harga_awal` int(11) NOT NULL,
  `harga_driver` int(11) NOT NULL,
  `kode_promo` varchar(10) DEFAULT NULL,
  `harga_potongan` int(11) DEFAULT 0,
  `harga_untung` int(11) NOT NULL,
  `metode_bayar` enum('QRIS','Tunai') NOT NULL,
  `metode_antar` enum('Same-day','Express') NOT NULL,
  `nama_driver` varchar(50) DEFAULT NULL,
  `telp_driver` varchar(25) DEFAULT NULL,
  `status` varchar(30) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `transaksi`
--

INSERT INTO `transaksi` (`id`, `rs_id`, `nama_pasien`, `alamat_pasien`, `long_pasien`, `lat_pasien`, `telp_pasien`, `no_antrian`, `no_resi`, `jarak_antar`, `harga_awal`, `harga_driver`, `kode_promo`, `harga_potongan`, `harga_untung`, `metode_bayar`, `metode_antar`, `nama_driver`, `telp_driver`, `status`, `created_at`, `updated_at`) VALUES
(20, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893573', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'nulllll', '+62823576983', 'Obat Diracik', '2022-02-26 19:03:51', '2022-03-19 10:36:18'),
(21, 2, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSUDS-160893573', 3.1, 12000, 6000, NULL, 0, 6000, 'Tunai', 'Same-day', 'Supar', '082334568', 'Obat Diterima', '2022-02-26 19:06:05', '2022-03-19 11:08:52'),
(22, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893572', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'iqballl', '+62823576983', 'Obat Diterima', '2022-02-26 19:03:51', '2022-03-20 01:19:32'),
(24, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893574', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Supp', '+62823576983', 'Menunggu Diambil', '2022-02-26 19:03:51', '2022-03-19 10:35:30'),
(25, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893570', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'hehe', '+62823576983', 'Obat Siap', '2022-02-26 19:03:51', '2022-03-19 16:16:52'),
(26, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893555', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparm', '+62823576983', 'Obat Siap', '2022-02-26 19:03:51', '2022-03-19 13:08:35'),
(27, 2, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSUDS-160893522', 3.1, 12000, 6000, NULL, 0, 6000, 'Tunai', 'Same-day', 'Suparma', '082334568', 'Menunggu Diambil', '2022-02-26 19:06:05', '2022-03-20 02:10:01'),
(28, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893567', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32'),
(29, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893523', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32'),
(30, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893579', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32'),
(31, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160593573', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32'),
(32, 2, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSUDS-168893573', 3.1, 12000, 6000, NULL, 0, 6000, 'Tunai', 'Same-day', 'Suparma', '082334568', 'Belum Dibayar', '2022-02-26 19:06:05', '2022-03-19 10:09:32'),
(33, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160823572', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32'),
(34, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160823574', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Obat Siap', '2022-02-26 19:03:51', '2022-03-20 01:49:01'),
(35, 1, 'Aldo', 'Gresik Kota Baru', -1.99, 22.5, '0823476839', 5, 'RSLM-160893470', 3.1, 12000, 6000, NULL, 0, 6000, 'QRIS', 'Same-day', 'Suparman', '+62823576983', 'Belum Dibayar', '2022-02-26 19:03:51', '2022-03-19 10:09:32');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` int(11) NOT NULL,
  `username` varchar(25) NOT NULL,
  `pin` varchar(100) NOT NULL,
  `role` varchar(10) NOT NULL DEFAULT 'admin',
  `nama` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `pin`, `role`, `nama`, `created_at`, `updated_at`) VALUES
(1, 'alvin', '123456', 'admin', 'Muhammad Alvin Hilmy', '2022-02-25 20:12:22', '2022-02-26 13:32:01');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `harga`
--
ALTER TABLE `harga`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `promo`
--
ALTER TABLE `promo`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `riwayat`
--
ALTER TABLE `riwayat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `transaksi_id` (`transaksi_id`);

--
-- Indexes for table `rs`
--
ALTER TABLE `rs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_rs` (`kode_rs`);

--
-- Indexes for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_resi` (`no_resi`),
  ADD KEY `rs_id` (`rs_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `harga`
--
ALTER TABLE `harga`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `promo`
--
ALTER TABLE `promo`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `riwayat`
--
ALTER TABLE `riwayat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

--
-- AUTO_INCREMENT for table `rs`
--
ALTER TABLE `rs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `transaksi`
--
ALTER TABLE `transaksi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=36;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `riwayat`
--
ALTER TABLE `riwayat`
  ADD CONSTRAINT `riwayat_ibfk_1` FOREIGN KEY (`transaksi_id`) REFERENCES `transaksi` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi`
--
ALTER TABLE `transaksi`
  ADD CONSTRAINT `transaksi_ibfk_1` FOREIGN KEY (`rs_id`) REFERENCES `rs` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
