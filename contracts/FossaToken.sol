// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

contract FossaToken {
    // Adres właściciela kontraktu
    address public owner;
    // Nazwa żetonu
    string public name = "FossaToken";
    // Symbol żetonu
    string public symbol = "FOSSA";
    // Miejsca dziesiętne jednostki żetonu
    uint8 public constant decimals = 0;
    // Całkowite zaopatrzenie w żetony
    uint256 public totalSupply;

    // Wydarzenie emitowane podczas transferu
    event Transfer(address indexed _from, address indexed _to, uint256 _value);
    // Wydarzenie emitowane podczas zatwierdzenia
    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );
    //Mapowanie adresu na balans konta
    mapping(address => uint256) public balanceOf;
    //Mapowanie adresu na wartość zmapowaną dozwolonej ilości
    mapping(address => mapping(address => uint256)) public allowance;

    //Konstruktor
    constructor(uint256 supply) {
        owner = msg.sender;
        balanceOf[owner] = supply;
        totalSupply = supply;
    }

    //Transfer wartości na inny adres
    function transfer(address _to, uint256 _value) public returns (bool) {
        require(
            balanceOf[msg.sender] >= _value,
            "Niewystarczajacy balans konta"
        );
        _transfer(msg.sender, _to, _value);
        return true;
    }

    function _transfer(address _from, address _to, uint256 _value) internal {
        require(_to != address(0), "Niewlasciwy adres odbiorcy");

        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        emit Transfer(_from, _to, _value);
    }

    //Zatwierdzenie wartości
    function approve(address _spender, uint256 _value) public returns (bool) {
        require(_spender != address(0), "Niewlasciwy adres wysylajacego");

        require(_value >= 0, "Wartosc dozwolonej ilosci nie moze byc ujemna");

        // Warunek do zmniejszenia zużycia gazu jeżeli allowance już istnieje
        if (_value < allowance[msg.sender][_spender]) {
            allowance[msg.sender][_spender] = _value;
        } else if (_value > allowance[msg.sender][_spender]) {
            //Jeżeli allowance jest zwiększone to wartość jest aktualizowana
            allowance[msg.sender][_spender] = _value;
            emit Approval(msg.sender, _spender, _value);
        }

        return true;
    }

    // Transfer od adresu dla adresu z wartością
    function transferFrom(
        address _from,
        address _to,
        uint256 _value
    ) public returns (bool) {
        require(_value > 0, "Wartosc transferu musi byc wieksza od zera");

        require(balanceOf[_from] >= _value, "Niwystarczajacy balans konta");

        require(
            allowance[_from][msg.sender] >= _value,
            "Dozwolona ilosc nie jest wystarczajaco duza"
        );

        require(
            balanceOf[_to] + _value > balanceOf[_to],
            "Sprawdza czy wartosc moze zostac dodana do konta docelowego"
        );

        require(
            allowance[_from][msg.sender] - _value <=
                allowance[_from][msg.sender],
            "Dozwolona ilosc jest za mala"
        );

        allowance[_from][msg.sender] -= _value;

        _transfer(_from, _to, _value);

        return true;
    }

    // Funkcja obsługuje przekazanie Etheru do kontraktu
    receive() external payable {}
}
