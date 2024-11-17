#[starknet::contract]
mod ReviewContract {
    use starknet::{ContractAddress, get_caller_address};
    use array::ArrayTrait;
    use traits::Into;
    use option::OptionTrait;

    #[storage]
    struct Storage {
        user_reviews: LegacyMap::<ContractAddress, Array<felt252>>,
        owner: ContractAddress,
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        UserRegistered: UserRegistered,
        ReviewAdded: ReviewAdded,
    }

    #[derive(Drop, starknet::Event)]
    struct UserRegistered {
        address: ContractAddress,
    }

    #[derive(Drop, starknet::Event)]
    struct ReviewAdded {
        address: ContractAddress,
        review_hash: felt252,
    }

    #[constructor]
    fn constructor(ref self: ContractState, owner: ContractAddress) {
        self.owner.write(owner);
    }

    #[external(v0)]
    fn register_user(ref self: ContractState) {
        let caller = get_caller_address();
        // Проверяем, что пользователь еще не зарегистрирован
        assert(self.user_reviews.read(caller).is_none(), "User already registered");
        self.user_reviews.write(caller, ArrayTrait::new());
        self.emit(Event::UserRegistered(UserRegistered { address: caller }));
    }

    #[external(v0)]
    fn add_review(ref self: ContractState, review_hash: felt252) {
        let caller = get_caller_address();
        assert(self.user_reviews.read(caller).is_some(), "User not registered");
        assert(review_hash != 0, "Review hash cannot be empty");
        let mut reviews = self.user_reviews.read(caller).unwrap();
        reviews.append(review_hash);
        self.user_reviews.write(caller, reviews);
        self.emit(Event::ReviewAdded(ReviewAdded { address: caller, review_hash }));
    }

    #[external(v0)]
    fn get_reviews(self: @ContractState, address: ContractAddress) -> Array<felt252> {
        assert(self.user_reviews.read(address).is_some(), "User not registered");
        self.user_reviews.read(address).unwrap()
    }

    #[external(v0)]
    fn get_user_review_count(self: @ContractState, address: ContractAddress) -> u32 {
        if let Some(reviews) = self.user_reviews.read(address) {
            reviews.len()
        } else {
            0
        }
    }

    #[external(v0)]
    fn is_user_registered(self: @ContractState, address: ContractAddress) -> bool {
        self.user_reviews.read(address).is_some()
    }
}
