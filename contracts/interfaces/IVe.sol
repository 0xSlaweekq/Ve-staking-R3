// SPDX-License-Identifier: MIT

pragma solidity ^0.8.8;

interface IVe {
    function balanceOfAtNFT(uint256 _tokenId, uint256 _block) external view returns (uint256);

    function balanceOfNFTAt(uint256 _tokenId, uint256 _t) external view returns (uint256);

    function totalSupplyAt(uint256 _block) external view returns (uint256);

    function totalSupplyAtT(uint256 t) external view returns (uint256);

    function ownerOf(uint256) external view returns (address);

    function create_lock(uint256 _value, uint256 _lock_duration) external returns (uint256);
}
