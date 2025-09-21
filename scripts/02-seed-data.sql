-- Insert sample users
INSERT INTO users (username, email, password_hash, role) VALUES
('crypto_analyst', 'analyst@monash.edu', '$2b$10$example_hash_1', 'PREMIUM_BLOGGER'),
('blockchain_student', 'student@monash.edu', '$2b$10$example_hash_2', 'BASIC_BLOGGER'),
('defi_researcher', 'researcher@monash.edu', '$2b$10$example_hash_3', 'PREMIUM_BLOGGER')
ON CONFLICT (email) DO NOTHING;

-- Insert sample posts
INSERT INTO posts (user_id, title, content) VALUES
(1, 'Understanding Bitcoin''s Lightning Network', 'The Lightning Network represents a significant advancement in Bitcoin''s scalability solutions. This layer-2 protocol enables instant, low-cost transactions by creating payment channels between users. In this comprehensive analysis, we explore how the Lightning Network works, its benefits, and potential challenges for widespread adoption in the cryptocurrency ecosystem.'),
(1, 'DeFi Yield Farming: Opportunities and Risks', 'Decentralized Finance (DeFi) has revolutionized traditional financial services through yield farming mechanisms. This practice allows users to earn rewards by providing liquidity to various protocols. However, with great rewards come significant risks including impermanent loss, smart contract vulnerabilities, and market volatility that every investor should understand.'),
(2, 'NFTs Beyond Art: Real-World Applications', 'Non-Fungible Tokens (NFTs) have evolved far beyond digital art collections. From supply chain verification to academic credentials, NFTs are finding practical applications across various industries. This post explores innovative use cases that demonstrate the true potential of blockchain-based digital ownership and verification systems.'),
(3, 'Central Bank Digital Currencies: The Future of Money?', 'As governments worldwide explore Central Bank Digital Currencies (CBDCs), we stand at a crossroads between traditional monetary systems and digital innovation. This analysis examines the implications of CBDCs for privacy, monetary policy, and the broader cryptocurrency ecosystem, drawing insights from pilot programs across different nations.')
ON CONFLICT DO NOTHING;

-- Insert sample comments
INSERT INTO comments (post_id, user_id, content) VALUES
(1, 2, 'Great explanation of the Lightning Network! The technical details really help understand the scalability benefits.'),
(1, 3, 'I''d love to see more analysis on the adoption challenges you mentioned. What are the main barriers for everyday users?'),
(2, 3, 'The risk assessment section is particularly valuable. Too many people jump into yield farming without understanding impermanent loss.'),
(3, 1, 'Interesting perspective on NFT utility beyond art. The supply chain use case is especially compelling for enterprise adoption.')
ON CONFLICT DO NOTHING;

-- Insert sample likes
INSERT INTO post_likes (user_id, post_id) VALUES
(2, 1), (3, 1), (1, 3), (3, 2), (2, 4), (1, 4)
ON CONFLICT DO NOTHING;

-- Insert sample user activity for analytics
INSERT INTO user_activity (user_id, event_type, url, details) VALUES
(1, 'PAGE_VIEW', '/posts/1', '{"duration_seconds": 180}'),
(2, 'PAGE_VIEW', '/posts/1', '{"duration_seconds": 240}'),
(3, 'PAGE_VIEW', '/posts/2', '{"duration_seconds": 150}'),
(1, 'SHARE_CLICK', '/posts/3', '{"platform": "twitter"}'),
(2, 'TIME_SPENT', '/posts/1', '{"duration_seconds": 300}'),
(NULL, 'PAGE_VIEW', '/', '{"anonymous": true}')
ON CONFLICT DO NOTHING;
