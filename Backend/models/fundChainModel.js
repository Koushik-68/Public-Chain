const db = require("../config/db");
const crypto = require("crypto");

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest("hex");
}

async function getLastBlock() {
  const pool = await db.init();
  const [rows] = await pool.query(
    "SELECT * FROM fund_chain ORDER BY id DESC LIMIT 1"
  );
  return rows[0] || null;
}

async function addBlock(fundData) {
  const pool = await db.init();
  const lastBlock = await getLastBlock();
  const prev_hash = lastBlock ? lastBlock.block_hash : null;
  const timestamp = Date.now();
  const blockContent = JSON.stringify({
    fundData,
    prev_hash,
    timestamp,
  });
  const block_hash = sha256(blockContent);
  // For simplicity, signature is just a hash of block_hash with a secret
  const signature = sha256(block_hash + process.env.BLOCKCHAIN_SECRET);
  await pool.query(
    `INSERT INTO fund_chain (block_hash, prev_hash, fund_data, signature, timestamp) VALUES (?, ?, ?, ?, ?)`,
    [block_hash, prev_hash, JSON.stringify(fundData), signature, timestamp]
  );
  return { block_hash, prev_hash, signature };
}

async function getChain() {
  const pool = await db.init();
  const [rows] = await pool.query("SELECT * FROM fund_chain ORDER BY id ASC");
  return rows;
}

async function verifyChain() {
  const chain = await getChain();

  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const prev_hash = i === 0 ? null : chain[i - 1].block_hash;

    let fundData = block.fund_data;

    // If fundData is a string, parse it
    if (typeof fundData === "string") {
      try {
        fundData = JSON.parse(fundData);
      } catch (e) {
        // If parsing fails, just keep it as is
      }
    }

    // Use the raw timestamp value from DB for hash verification
    const blockContent = JSON.stringify({
      fundData,
      prev_hash,
      timestamp: block.timestamp,
    });
    const expected_hash = sha256(blockContent);
    const expected_signature = sha256(
      expected_hash + process.env.BLOCKCHAIN_SECRET
    );
    if (
      block.block_hash !== expected_hash ||
      block.signature !== expected_signature
    ) {
      return false;
    }
  }

  return true;
}

// 👇 Export in a TS-friendly way
exports.addBlock = addBlock;
exports.getChain = getChain;
exports.verifyChain = verifyChain;
exports.getLastBlock = getLastBlock;
